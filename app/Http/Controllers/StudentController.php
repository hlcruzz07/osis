<?php

namespace App\Http\Controllers;

use App\Exports\StudentsExport;
use App\Facades\ActivityLog;
use App\Http\Requests\AdditionalInfoRequest;
use App\Http\Requests\CreateGuardianRequest;
use App\Http\Requests\EducationInfoRequest;
use App\Http\Requests\ExportStudentsRequest;
use App\Http\Requests\FamilyInfoRequest;
use App\Http\Requests\StudentAddressInfo;
use App\Http\Requests\StudentContactAddressInfo;
use App\Http\Requests\StudentInfoRequest;
use App\Http\Requests\StudentStoreRequest;
use App\Http\Requests\UpdateAddressInfoRequest;
use App\Http\Requests\UpdateFamilyInfoRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Http\Requests\UpdateStudentInfoRequest;
use App\Jobs\ExportStudentsZipJob;
use App\Jobs\StoreStudentSubmission;
use App\Models\AcademicYearAndSemester;
use App\Models\EntityDropdown;
use App\Models\Student;
use App\Models\StudentAnswer;
use App\Repositories\AcademicYearAndSemesterRepo;
use App\Repositories\AnswerRepo;
use App\Repositories\GuardianRepo;
use App\Repositories\QuestionRepo;
use App\Repositories\StudentRepo;
use App\Services\ReferenceNumberService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected StudentRepo $studentRepo, protected QuestionRepo $questionRepo, protected AcademicYearAndSemesterRepo $academicYearAndSemesterRepo, protected AnswerRepo $answerRepo, protected ReferenceNumberService $referenceNumberService)
    {
    }

    // STUDENT SIDE

    public function index()
    {

        $questions = $this->questionRepo->getActive();

        $academic_year_and_semester = $this->academicYearAndSemesterRepo->getLatest();

        $dropdowns = cache()->remember('entity_dropdowns_all', 600, function () {
            return EntityDropdown::all();
        });

        return Inertia::render('Student/Index', [
            'questions' => $questions,
            'academic_year_and_semester' => $academic_year_and_semester,
            'dropdowns' => $dropdowns,
        ]);

    }

    public function validateStudentInfo(StudentInfoRequest $request)
    {
        return back()->with('success', "Student's information validated");
    }

    public function validateAddress(StudentAddressInfo $request)
    {
        return back()->with('success', "Student's address information validated");
    }

    public function validateEducation(EducationInfoRequest $request)
    {
        return back()->with('success', "Student's education information validated");
    }

    public function validateFamily(FamilyInfoRequest $request)
    {
        return back()->with('success', "Student's family information validated");
    }

    public function validateAdditionalInfo(AdditionalInfoRequest $request)
    {
        return back()->with('success', "Student's additional information validated");
    }

    public function store(StudentStoreRequest $request)
    {
        try {

            $data = $request->all();

            $randNumber = $this->referenceNumberService->generate();
            $academic_year = AcademicYearAndSemester::pluck('academic_year')->toArray()[0];
            $semester = AcademicYearAndSemester::pluck('semester')->toArray()[0];

            $student_data = array_merge(data_get($data, 'student'), [
                'ref_number' => $randNumber,
                'status' => 'Pending',
                'academic_year' => $academic_year,
                'semester' => $semester
            ]);

            $address_data = data_get($data, 'address');
            $educations_data = data_get($data, 'educations');
            $family_data = data_get($data, 'family');
            $guardians_data = data_get($data, 'guardians');
            $siblings_data = data_get($data, 'siblings') ?? null;
            $answers_data = data_get($data, 'answers');

            $student_main_answers = collect($answers_data)
                ->filter(fn($item) => is_null($item['sub_question_id']))
                ->values()
                ->toArray();

            $student_sub_answers = collect($answers_data)
                ->filter(fn($item) => !is_null($item['sub_question_id']) && !is_null($item['answer']))
                ->values()
                ->toArray();


            StoreStudentSubmission::dispatch([
                'student' => $student_data,
                'address' => $address_data,
                'siblings' => $siblings_data,
                'educations' => $educations_data,
                'family' => $family_data,
                'guardians' => $guardians_data,
                'answers' => $student_main_answers,
                'sub_answers' => $student_sub_answers,
            ]);

            $success_data = Arr::only($student_data, [
                'ref_number',
                'mname',
                'fname',
                'lname',
                'suffix',
            ]);

            return redirect()->route('success')->with('success_data', $success_data);

        } catch (Exception $e) {

            Log::error("Failed to insert students" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again');
        }
    }

    public function success()
    {
        return Inertia::render('Student/Success/Index', [
            'success_data' => session('success_data'),
        ]);
    }


    //ADMIN SIDE

    public function students()
    {
        $academicYears = Student::select('academic_year')
            ->distinct()
            ->pluck('academic_year');

        $semesters = Student::select('semester')
            ->distinct()
            ->pluck('semester');

        $dropdowns = EntityDropdown::all();

        $student_type_count = $this->studentRepo->getStudentTypeCount();

        return Inertia::render('Admin/Students/Index', [
            'dropdowns' => $dropdowns,
            'academic_years' => $academicYears,
            'semesters' => $semesters,
            'student_type_count' => $student_type_count
        ]);
    }

    public function view(int $id)
    {

        $student = $this->studentRepo->find($id);

        return Inertia::render('Admin/Students/View/Index', [
            'student' => $student,
            'dropdowns' => EntityDropdown::all()
        ]);
    }

    public function update(UpdateStudentInfoRequest $request, int $id)
    {
        try {
            $this->studentRepo->updateStudentById($id, $request->all());

            ActivityLog::log('update', "updated student information for id: $id", Auth::user()->email, request(), 'success');

            return back()->with('success', 'Student Information updated!');

        } catch (Exception $e) {

            ActivityLog::log('update', "Failed to update student for id $id: " . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to update student info for ID $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }


    public function export(ExportStudentsRequest $request)
    {
        try {
            $students = $this->studentRepo->export($request->all());

            if ($students->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No students found'
                ], 400);
            }

            ExportStudentsZipJob::dispatch($students);

            ActivityLog::log('export', 'Exported (' . count($students) . ') students data', Auth::user()->email, request(), 'success');

            return response()->json([
                'status' => 'success',
            ]);

        } catch (Exception $e) {

            Log::error("Failed to export students: " . $e->getMessage());

            ActivityLog::log('export', 'Failed to export students data: ' . $e->getMessage(), Auth::user()->email, request(), 'failed');

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function updateStatus(Request $request, int $id)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:Pending,Accepted,Declined'
            ]);

            $student = $this->studentRepo->updateStudentById($id, $validated);

            $updated_status = $student['status'];

            ActivityLog::log('update', "updated student's status to $updated_status for id: $id", Auth::user()->email, request(), 'success');

            return back()->with('success', "Student's Status updated!");

        } catch (Exception $e) {

            ActivityLog::log('update', "Failed to update student's status for id $id: " . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to update student's status for ID $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }









}

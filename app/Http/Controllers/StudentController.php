<?php

namespace App\Http\Controllers;

use App\Exports\StudentsExport;
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
use App\Models\EntityDropdown;
use App\Models\Student;
use App\Repositories\AcademicYearAndSemesterRepo;
use App\Repositories\AnswerRepo;
use App\Repositories\GuardianRepo;
use App\Repositories\QuestionRepo;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected StudentRepo $studentRepo, protected QuestionRepo $questionRepo, protected AcademicYearAndSemesterRepo $academicYearAndSemesterRepo, protected AnswerRepo $answerRepo)
    {
    }

    // STUDENT SIDE

    public function index()
    {
        $questions = cache()->remember('student_active_questions', 600, function () {
            return $this->questionRepo->getActive();
        });

        $academic_year_and_semester = cache()->remember('latest_academic_year_semester', 600, function () {
            return $this->academicYearAndSemesterRepo->getLatest();
        });

        $dropdowns = cache()->remember('entity_dropdowns_all', 3600, function () {
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

            $student_data = data_get($data, 'student');
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

            return back()->with('success', 'Student successfully submitted!');

        } catch (Exception $e) {

            Log::error("Failed to insert students" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again');
        }
    }

    //ADMIN SIDE

    public function students()
    {

        $academicYears = Cache::remember('academic_years', 3600, function () {
            return Student::select('academic_year')
                ->distinct()
                ->pluck('academic_year');
        });

        $semesters = Cache::remember('semesters', 3600, function () {
            return Student::select('semester')
                ->distinct()
                ->pluck('semester');
        });

        $dropdowns = Cache::remember('entity_dropdowns', 3600, function () {
            return EntityDropdown::all();
        });

        return Inertia::render('Admin/Students/Index', [
            'dropdowns' => $dropdowns,
            'academic_years' => $academicYears,
            'semesters' => $semesters
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

            return back()->with('success', 'Student Information updated!');

        } catch (Exception $e) {

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

            return response()->json([
                'status' => 'success',

            ]);

        } catch (Exception $e) {

            Log::error("Failed to export students: " . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }









}

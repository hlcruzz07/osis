<?php

namespace App\Http\Controllers;

use App\Exports\StudentsExport;
use App\Facades\ActivityLog;
use App\Http\Requests\AdditionalInfoRequest;
use App\Http\Requests\CreateGuardianRequest;
use App\Http\Requests\EducationInfoRequest;
use App\Http\Requests\ExportStudentsRequest;
use App\Http\Requests\FamilyInfoRequest;
use App\Http\Requests\StoreRegistrarRequest;
use App\Http\Requests\StoreScholarshipRequest;
use App\Http\Requests\StudentAddressInfo;
use App\Http\Requests\StudentContactAddressInfo;
use App\Http\Requests\StudentInfoRequest;
use App\Http\Requests\StudentStoreRequest;
use App\Http\Requests\UpdateAddressInfoRequest;
use App\Http\Requests\UpdateFamilyInfoRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Http\Requests\UpdateStudentInfoRequest;
use App\Jobs\ExportStudentsPdfJob;
use App\Jobs\ExportStudentsZipJob;
use App\Jobs\StoreStudentSubmission;
use App\Models\AcademicYearAndSemester;
use App\Models\EntityDropdown;
use App\Models\Student;
use App\Models\StudentAnswer;
use App\Repositories\AcademicYearAndSemesterRepo;
use App\Repositories\AddressRepo;
use App\Repositories\AnswerRepo;
use App\Repositories\EducationRepo;
use App\Repositories\FamilyInfoRepo;
use App\Repositories\GuardianRepo;
use App\Repositories\QuestionRepo;
use App\Repositories\SiblingRepo;
use App\Repositories\StudentRepo;
use App\Services\HashingService;
use App\Services\ReferenceNumberService;
use Barryvdh\DomPDF\Facade\Pdf;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected HashingService $hashingService, protected StudentRepo $studentRepo, protected QuestionRepo $questionRepo, protected AcademicYearAndSemesterRepo $academicYearAndSemesterRepo, protected AnswerRepo $answerRepo, protected ReferenceNumberService $referenceNumberService, protected GuardianRepo $guardianRepo, protected EducationRepo $educationRepo, protected FamilyInfoRepo $familyInfoRepo, protected AddressRepo $addressRepo, protected SiblingRepo $siblingRepo)
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

        return Inertia::render('Student/Forms/Index', [
            'questions' => $questions,
            'academic_year_and_semester' => $academic_year_and_semester,
            'dropdowns' => $dropdowns,
        ]);
    }

    public function registrar()
    {

        $questions = $this->questionRepo->getActive();


        $academic_year_and_semester = $this->academicYearAndSemesterRepo->getLatest();

        $dropdowns = cache()->remember('entity_dropdowns_all', 600, function () {
            return EntityDropdown::all();
        });

        return Inertia::render('Student/Forms/Registrar', [
            'questions' => $questions,
            'academic_year_and_semester' => $academic_year_and_semester,
            'dropdowns' => $dropdowns,
        ]);
    }

    public function scholarship(string $ref_number)
    {
        if (!$this->studentRepo->isValidReferenceNumber($ref_number)) {
            return redirect()->back()->with('error', 'Invalid reference number');
        }

        if (!$this->studentRepo->hasUpdatedGuidanceByReferenceNumber($ref_number)) {
            return redirect()->back()->with('error', 'Please complete the guidance information first');
        }

        if ($this->studentRepo->hasUpdatedScholarshipByReferenceNumber($ref_number)) {
            return redirect()->back()->with('error', 'Scholarship Information already submitted');
        }

        $questions = $this->questionRepo->getActive();

        $student = $this->studentRepo->getStudentByReferenceNumber($ref_number);

        $dropdowns = cache()->remember('entity_dropdowns_all', 600, function () {
            return EntityDropdown::all();
        });

        return Inertia::render('Student/Forms/Scholarship', [
            'questions' => $questions,
            'student' => $student,
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


            DB::transaction(function () use ($student_data, $address_data, $educations_data, $family_data, $guardians_data, $siblings_data, $student_main_answers, $student_sub_answers) {

                $student_id = $this->studentRepo->storeStudent($student_data);

                $this->addressRepo->storeStudentAddress(
                    $address_data,
                    $student_id
                );

                $this->educationRepo->store(
                    $educations_data,
                    $student_id
                );

                $this->familyInfoRepo->store(
                    $family_data,
                    $student_id
                );

                if (!empty($siblings_data)) {
                    $this->siblingRepo->storeSiblings(
                        $siblings_data,
                        $student_id
                    );
                }

                $this->guardianRepo->store(
                    $guardians_data,
                    $student_id
                );

                $this->answerRepo->storeAnswers(
                    $student_main_answers,
                    $student_id
                );

                if (!empty($student_sub_answers)) {
                    $this->answerRepo->storeSubAnswers(
                        $student_sub_answers,
                        $student_id
                    );
                }
            });

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

    public function storeRegistrar(StoreRegistrarRequest $request)
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
            $guardians_data = data_get($data, 'guardians');
            $answers_data = data_get($data, 'answers');

            $student_main_answers = collect($answers_data)
                ->filter(fn($item) => is_null($item['sub_question_id']))
                ->values()
                ->toArray();

            $student_sub_answers = collect($answers_data)
                ->filter(fn($item) => !is_null($item['sub_question_id']) && !is_null($item['answer']))
                ->values()
                ->toArray();

            DB::transaction(function () use ($student_data, $address_data, $educations_data, $guardians_data, $student_main_answers, $student_sub_answers) {

                $student_id = $this->studentRepo->storeStudent($student_data);

                $this->addressRepo->storeStudentAddress(
                    $address_data,
                    $student_id
                );

                $this->educationRepo->store(
                    $educations_data,
                    $student_id
                );

                $this->guardianRepo->store(
                    $guardians_data,
                    $student_id
                );

                $this->answerRepo->storeAnswers(
                    $student_main_answers,
                    $student_id
                );

                if (!empty($student_sub_answers)) {
                    $this->answerRepo->storeSubAnswers(
                        $student_sub_answers,
                        $student_id
                    );
                }
            });

            $success_data = Arr::only($student_data, [
                'ref_number',
                'mname',
                'fname',
                'lname',
                'suffix',
            ]);

            return redirect()->route('success')->with('success_data', $success_data);
        } catch (Exception $e) {

            Log::error("Failed to insert registrar student: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again');
        }
    }

    public function storeScholarship(StoreScholarshipRequest $request, string $ref_number)
    {
        try {
            $data = $request->all();

            $student_data = data_get($data, 'student');
            $scholarships_data = data_get($data, 'scholarships');

            DB::transaction(function () use ($student_data, $scholarships_data, $ref_number) {

                $student = $this->studentRepo->updateStudentByReferenceNumber($student_data, $ref_number);

                foreach ($scholarships_data as $scholarship) {
                    $student->scholarships()->create([
                        'name' => $scholarship['name'],
                        'name_hash' => $this->hashingService->hashValue($scholarship['name']),
                        'type' => $scholarship['type'],
                        'type_hash' => $this->hashingService->hashValue($scholarship['type'])
                    ]);
                }
                $student->update(['is_complete_scholarship' => true]);
            });

            return redirect()->route('home')->with('success', 'Student Scholarship Information Submitted!');
        } catch (Exception $e) {

            Log::error("Failed to update scholarship student: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again');
        }
    }

    public function guidance(string $ref_number)
    {
        if (!$this->studentRepo->isValidReferenceNumber($ref_number)) {
            return redirect()->back()->with('error', 'Invalid reference number');
        }

        if ($this->studentRepo->hasUpdatedGuidanceByReferenceNumber($ref_number)) {
            return redirect()->back()->with('error', 'Guidance Information already submitted');
        }

        $questions = $this->questionRepo->getActive();

        $student = $this->studentRepo->getStudentByReferenceNumber($ref_number);

        $dropdowns = cache()->remember('entity_dropdowns_all', 600, function () {
            return EntityDropdown::all();
        });

        return Inertia::render('Student/Forms/Guidance', [
            'questions' => $questions,
            'student' => $student,
            'dropdowns' => $dropdowns,
        ]);
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

            // Load relations
            $students->load([
                'guardians.address',
                'address',
                'educations',
                'siblings',
                'familyInfo',
            ]);

            ActivityLog::log('export', 'Exported (' . count($students) . ') students data', Auth::user()->email, request(), 'success');

            // Return direct download instead of storing to disk
            return Excel::download(
                new \App\Exports\StudentsCollectionExport($students),
                'students.xlsx'
            );
        } catch (Exception $e) {

            Log::error("Failed to export students: " . $e->getMessage());

            ActivityLog::log('export', 'Failed to export students data: ' . $e->getMessage(), Auth::user()->email, request(), 'failed');

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function exportPdf(ExportStudentsRequest $request)
    {
        try {
            $students = $this->studentRepo->export($request->all());


            ActivityLog::log('export', 'Exported (' . count($students) . ') students data', Auth::user()->email, request(), 'success');

            return view('pdf.students', ['students' => $students]);
        } catch (Exception $e) {

            Log::error("Failed to export students: " . $e->getMessage());

            ActivityLog::log('export', 'Failed to export students data: ' . $e->getMessage(), Auth::user()->email, request(), 'failed');

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }

    public function previewPdf()
    {
        $path = storage_path("app/exports/students.pdf");

        if (!file_exists($path)) {
            abort(404, 'File not ready yet');
        }

        return response()->file($path);
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

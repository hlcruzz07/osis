<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\AdditionalInfoRequest;
use App\Http\Requests\EducationInfoRequest;
use App\Http\Requests\ExportStudentsRequest;
use App\Http\Requests\FamilyInfoRequest;
use App\Http\Requests\StoreGuidanceRequest;
use App\Http\Requests\StoreRegistrarRequest;
use App\Http\Requests\StoreScholarshipRequest;
use App\Http\Requests\StudentAddressInfo;
use App\Http\Requests\StudentInfoRequest;
use App\Http\Requests\StudentStoreRequest;
use App\Http\Requests\UpdateStudentInfoRequest;
use App\Models\AcademicYearAndSemester;
use App\Models\EntityDropdown;
use App\Models\Student;
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
use App\Services\GoogleDriveService;
use App\Services\ReferenceNumberService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected HashingService $hashingService, protected StudentRepo $studentRepo, protected QuestionRepo $questionRepo, protected AcademicYearAndSemesterRepo $academicYearAndSemesterRepo, protected AnswerRepo $answerRepo, protected ReferenceNumberService $referenceNumberService, protected GuardianRepo $guardianRepo, protected EducationRepo $educationRepo, protected FamilyInfoRepo $familyInfoRepo, protected AddressRepo $addressRepo, protected SiblingRepo $siblingRepo, protected GoogleDriveService $googleDriveService) {}

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

                $student = $this->studentRepo->storeStudent($student_data);

                $student_id = $student->id;

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

                $student = $this->studentRepo->storeStudent($student_data);

                $this->addressRepo->storeStudentAddress(
                    $address_data,
                    $student->id
                );

                $this->educationRepo->store(
                    $educations_data,
                    $student->id
                );

                $this->guardianRepo->store(
                    $guardians_data,
                    $student->id
                );

                $this->answerRepo->storeAnswers(
                    $student_main_answers,
                    $student->id
                );

                if (!empty($student_sub_answers)) {
                    $this->answerRepo->storeSubAnswers(
                        $student_sub_answers,
                        $student->id
                    );
                }

                $connection = match (strtolower($student->campus)) {
                    'talisay' => 'tal_mysql',
                    'alijis' => 'ali_mysql',
                    'fortune towne' => 'ft_mysql',
                    'binalbagan' => 'bin_mysql',
                    default => null,
                };

                if (!$connection) {
                    return null;
                }

                $contactPerson = $student->guardians
                    ->where('is_contact_person', true)
                    ->first();

                DB::connection($connection)
                    ->table('record')
                    ->insert([
                        'email' => $student->email,
                        'campus' => $student->campus,
                        'student_lastname' => $student->lname,
                        'student_firstname' => $student->fname,
                        'student_middlename' => $student->mname ?? ' ',
                        'extension' => $student->suffix ?? '',
                        'birthdate' => $student->birthdate,
                        'gender' => $student->gender,
                        'birthplace' => $student->birthplace,
                        'street' => $student->address->street,
                        'barangay' => "Brgy. " . $student->address->brgy,
                        'city' => $student->address->city,
                        'zip_code' => $student->address->zip_code,
                        'civilstatus' => $student->civil_status,
                        'religion' => $student->religion,
                        'contact_number' => $student->mobile_num ? "0" . $student->mobile_num : '',
                        'mother_lastname' => $student->guardians->where('role', 'Mother')->first()?->lname,
                        'mother_firstname' => $student->guardians->where('role', 'Mother')->first()?->fname,
                        'mother_middlename' => $student->guardians->where('role', 'Mother')->first()?->mname ?? '',
                        'mother_occupation' => $student->guardians->where('role', 'Mother')->first()?->occupation ?? '',
                        'father_lastname' => $student->guardians->where('role', 'Father')->first()?->lname,
                        'father_firstname' => $student->guardians->where('role', 'Father')->first()?->fname,
                        'father_middlename' => $student->guardians->where('role', 'Father')->first()?->mname ?? '',
                        'father_occupation' => $student->guardians->where('role', 'Father')->first()?->occupation ?? '',
                        'year_admitted' => date('d/m/Y', strtotime($student->date_admitted)),
                        'semester' => $student->semester === '1st Semester' ? 'First Semester' : 'Second Semester',
                        'year' => $student->academic_year,
                        'curriculum' => 'N/A',
                        'lrn_no' => $student->lrn ?? '',
                        'e_name_of_school' => $student->educations->where('education_level', 'Elementary')->first()?->school_name ?? '',
                        'e_address_of_school' => $student->educations->where('education_level', 'Elementary')->first()?->school_address ?? '',
                        'e_school_year_attended' => $student->educations->where('education_level', 'Elementary')->first()?->year_graduated ?? '',
                        's_name_of_school' => $student->educations->where('education_level', 'Junior High School')->first()?->school_name ?? '',
                        's_address_of_school' => $student->educations->where('education_level', 'Junior High School')->first()?->school_address ?? '',
                        's_school_year_attended' => $student->educations->where('education_level', 'Junior High School')->first()?->year_graduated ?? '',
                        'shs_name_of_school' => $student->educations->where('education_level', 'Senior High School')->first()?->school_name ?? '',
                        'shs_address_of_school' => $student->educations->where('education_level', 'Senior High School')->first()?->school_address ?? '',
                        'shs_school_year_attended' => $student->educations->where('education_level', 'Senior High School')->first()?->year_graduated ?? '',
                        'c_name_of_school' => $student->educations->where('education_level', 'College')->first()?->school_name ?? '',
                        'c_address_of_school' => $student->educations->where('education_level', 'College')->first()?->school_address ?? '',
                        'c_school_year_attended' => $student->educations->where('education_level', 'College')->first()?->year_graduated ?? '',
                        'g_name_of_school' => $student->educations->where('education_level', 'Grad School')->first()?->school_name ?? '',
                        'g_address_of_school' => $student->educations->where('education_level', 'Grad School')->first()?->school_address ?? '',
                        'g_school_year_attended' => $student->educations->where('education_level', 'Grad School')->first()?->year_graduated ?? '',
                        'scholarship_title' => $student->scholarship_program ?? '',
                        'scholarship_contactperson' => $student->scholarship_contact ?? '',
                        'scholarship_address' => $student->scholarship_address ?? '',
                        'scholarship_contactnumber' => $student->scholarship_contact ? "0" . $student->scholarship_contact : '',
                        'person_notify_name' => $contactPerson
                            ? trim(implode(' ', array_filter([
                                $contactPerson->fname,
                                $contactPerson->mname ? $contactPerson->mname . '.' : null,
                                $contactPerson->lname,
                                $contactPerson->suffix,
                            ])))
                            : null,

                        'person_notify_address' => $contactPerson->address
                            ? trim(implode(', ', array_filter([
                                $contactPerson->address->street ?? null,
                                'Brgy. ' . $contactPerson->address->brgy,
                                $contactPerson->address->city,
                                $contactPerson->address->province,
                                $contactPerson->address->zip_code,
                            ])))
                            : null,
                        'person_notify_cellphone' => $contactPerson->mobile_num ? "0" . $contactPerson->mobile_num : '',
                        'mother_highest_educational_attainment' => $student->guardians->where('role', 'Mother')->first()?->highest_educ_attainment,
                        'father_highest_educational_attainment' => $student->guardians->where('role', 'Father')->first()?->highest_educ_attainment,
                        'first_gen_student' => (int) $student->answers()
                            ->where('question_id', 6)
                            ->where('answer_boolean', true)
                            ->exists() ? "1" : "0",

                        'ip_or_icc' => (int) $student->answers()
                            ->where('question_id', 7)
                            ->where('answer_boolean', true)
                            ->exists() ? "1" : "0",
                        'ip_or_icc_yes' => (int) $student->answers()
                            ->where('question_id', 7)
                            ->where('answer_boolean', true)
                            ->exists() ? "1" : "0",
                        'shs_school_type' => $student->educations->where('education_level', 'Senior High School')->first()?->school_type ?? '',
                        'college_school_type' => $student->educations->where('education_level', 'College')->first()?->school_type ?? '',
                    ]);
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

    public function storeGuidance(StoreGuidanceRequest $request, string $ref_number)
    {
        try {
            $student_data    = $request->input('student');
            $family_data     = $request->input('family');
            $educations_data = $request->input('educations', []);
            $guardians_data  = $request->input('guardians', []);
            $siblings_data  = $request->input('siblings', []);
            $answers_data    = $request->input('answers', []);
            $psych_tests_data = $request->input('psych_tests', []);
            $answers_files   = $request->file('answers', []);

            DB::transaction(function () use (
                $student_data,
                $family_data,
                $educations_data,
                $guardians_data,
                $siblings_data,
                $answers_data,
                $psych_tests_data,
                $answers_files,
                $ref_number,

            ) {
                // Update student fields
                $student = $this->studentRepo->updateStudentByReferenceNumber($student_data, $ref_number);

                // Update family info
                $student->familyInfo()->updateOrCreate(
                    ['student_id' => $student->id],
                    $this->hashingService->appendHashValues($family_data)
                );

                // Create new education levels only (skip pre-existing ones)
                foreach ($educations_data as $education) {
                    $this->educationRepo->createIfNotExists($education, $student->id);
                }

                if (!empty($siblings_data)) {
                    $this->siblingRepo->storeSiblings(
                        $siblings_data,
                        $student->id
                    );
                }



                // Update pre-existing guardians by id
                foreach ($guardians_data as $guardian) {
                    if (empty($guardian['id'])) {
                        continue;
                    }

                    $existingGuardian = $student->guardians()->find((int) $guardian['id']);
                    if (!$existingGuardian) {
                        continue;
                    }

                    $updateFields = array_filter([
                        'birthplace'     => $guardian['birthplace']     ?? null,
                        'citizenship'    => $guardian['citizenship']    ?? null,
                        'religion'       => $guardian['religion']       ?? null,
                        'life_status'    => $guardian['life_status']    ?? null,
                        'cause_of_death' => $guardian['cause_of_death'] ?? null,
                        'year_of_death'  => $guardian['year_of_death']  ?? null,
                        'occupation'     => $guardian['occupation']     ?? null,
                        'birthdate'      => $guardian['birthdate']     ?? null,
                    ], fn($v) => !is_null($v));

                    if (!empty($updateFields)) {
                        $existingGuardian->update(
                            $this->hashingService->appendHashValues($updateFields)
                        );
                    }
                }

                // Store answers
                $main_answers = collect($answers_data)
                    ->filter(fn($a) => is_null($a['sub_question_id']))
                    ->values()
                    ->toArray();

                $sub_answers = collect($answers_data)
                    ->filter(fn($a) => !is_null($a['sub_question_id']) && !is_null($a['answer']))
                    ->values()
                    ->toArray();

                $this->answerRepo->storeAnswers($main_answers, $student->id);

                if (!empty($sub_answers)) {
                    $this->answerRepo->storeSubAnswers($sub_answers, $student->id);
                }

                // Upload proof attachments to Google Drive
                foreach ($answers_data as $idx => $answerItem) {
                    $proofFiles = $answers_files[$idx]['proof'] ?? [];
                    if (empty($proofFiles)) {
                        continue;
                    }

                    $storedAnswer = $student->answers()
                        ->where('question_id', $answerItem['question_id'])
                        ->first();

                    if (!$storedAnswer) {
                        continue;
                    }

                    foreach ((array) $proofFiles as $proofFile) {
                        if (!($proofFile instanceof \Illuminate\Http\UploadedFile)) {
                            continue;
                        }

                        $uploaded = $this->googleDriveService->uploadPicture(
                            $proofFile,
                            $student->campus ?? 'General',
                            'Answer Proofs'
                        );

                        $storedAnswer->attachments()->create([
                            'img' => $uploaded['id'],
                        ]);
                    }
                }

                // Store psych tests
                foreach ($psych_tests_data as $test) {
                    $student->psychTests()->create(
                        $this->hashingService->appendHashValues([
                            'name'           => $test['name'],
                            'date_taken'     => $test['date_taken'],
                            'result'         => $test['result'],
                            'interpretation' => $test['interpretation'] ?? null,
                        ])
                    );
                }

                $student->update(['is_complete_guidance' => true]);
            });

            return redirect()->route('home')->with('success', 'Student Guidance Information Submitted!');
        } catch (Exception $e) {

            Log::error("Failed to update guidance student: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again');
        }
    }


    public function success()
    {
        return Inertia::render('Student/Success/Index', [
            'success_data' => session('success_data'),
        ]);
    }

    public function successGuidance()
    {
        return Inertia::render('Student/Success/GuidanceIndex', [
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
    private function formatBirthdate(string $birthdate): ?string
    {
        if (empty($birthdate)) {
            return null;
        }

        // Already a Carbon/DateTime instance (e.g. if the model casts it)
        if ($birthdate instanceof \DateTimeInterface) {
            return Carbon::parse($birthdate)->format('Y-m-d H:i:s');
        }

        try {
            return Carbon::parse($birthdate)->format('Y-m-d H:i:s');
        } catch (\Exception $e) {
            Log::warning("Unparseable birthdate: {$birthdate}");
            return null;
        }
    }
    private function mapStudentToRecordRow(Student $student): array
    {
        $contactPerson = $student->guardians->where('is_contact_person', true)->first();

        return [
            'email' => $student->email,
            'campus' => $student->campus,
            'student_lastname' => $student->lname,
            'student_firstname' => $student->fname,
            'student_middlename' => $student->mname ?? '',
            'extension' => $student->suffix ?? '',
            'birthdate' => $this->formatBirthdate($student->birthdate),
            'gender' => $student->gender,
            'birthplace' => $student->birthplace,
            'street' => $student->address->street ?? '',
            'barangay' => $student->address ? "Brgy. " . $student->address->brgy : '',
            'city' => $student->address->city ?? '',
            'zip_code' => $student->address->zip_code ?? '',
            'civilstatus' => $student->civil_status,
            'religion' => $student->religion,
            'contact_number' => $student->mobile_num ? "0" . $student->mobile_num : '',
            'mother_lastname' => $student->guardians->where('role', 'Mother')->first()?->lname,
            'mother_firstname' => $student->guardians->where('role', 'Mother')->first()?->fname,
            'mother_middlename' => $student->guardians->where('role', 'Mother')->first()?->mname ?? '',
            'mother_occupation' => $student->guardians->where('role', 'Mother')->first()?->occupation ?? '',
            'father_lastname' => $student->guardians->where('role', 'Father')->first()?->lname,
            'father_firstname' => $student->guardians->where('role', 'Father')->first()?->fname,
            'father_middlename' => $student->guardians->where('role', 'Father')->first()?->mname ?? '',
            'father_occupation' => $student->guardians->where('role', 'Father')->first()?->occupation ?? '',
            'year_admitted' => $student->date_admitted ? date('d/m/Y', strtotime($student->date_admitted)) : '',
            'semester' => $student->semester === '1st Semester' ? 'First Semester' : 'Second Semester',
            'year' => $student->academic_year,
            'curriculum' => 'N/A',
            'lrn_no' => $student->lrn ?? '',
            'e_name_of_school' => $student->educations->where('education_level', 'Elementary')->first()?->school_name ?? '',
            'e_address_of_school' => $student->educations->where('education_level', 'Elementary')->first()?->school_address ?? '',
            'e_school_year_attended' => $student->educations->where('education_level', 'Elementary')->first()?->year_graduated ?? '',
            's_name_of_school' => $student->educations->where('education_level', 'Junior High School')->first()?->school_name ?? '',
            's_address_of_school' => $student->educations->where('education_level', 'Junior High School')->first()?->school_address ?? '',
            's_school_year_attended' => $student->educations->where('education_level', 'Junior High School')->first()?->year_graduated ?? '',
            'shs_name_of_school' => $student->educations->where('education_level', 'Senior High School')->first()?->school_name ?? '',
            'shs_address_of_school' => $student->educations->where('education_level', 'Senior High School')->first()?->school_address ?? '',
            'shs_school_year_attended' => $student->educations->where('education_level', 'Senior High School')->first()?->year_graduated ?? '',
            'c_name_of_school' => $student->educations->where('education_level', 'College')->first()?->school_name ?? '',
            'c_address_of_school' => $student->educations->where('education_level', 'College')->first()?->school_address ?? '',
            'c_school_year_attended' => $student->educations->where('education_level', 'College')->first()?->year_graduated ?? '',
            'g_name_of_school' => $student->educations->where('education_level', 'Grad School')->first()?->school_name ?? '',
            'g_address_of_school' => $student->educations->where('education_level', 'Grad School')->first()?->school_address ?? '',
            'g_school_year_attended' => $student->educations->where('education_level', 'Grad School')->first()?->year_graduated ?? '',
            'scholarship_title' => $student->scholarship_program ?? '',
            'scholarship_contactperson' => $student->scholarship_contact ?? '',
            'scholarship_address' => $student->scholarship_address ?? '',
            'scholarship_contactnumber' => $student->scholarship_contact ? "0" . $student->scholarship_contact : '',
            'person_notify_name' => $contactPerson
                ? trim(implode(' ', array_filter([
                    $contactPerson->fname,
                    $contactPerson->mname ? $contactPerson->mname . '.' : null,
                    $contactPerson->lname,
                    $contactPerson->suffix,
                ])))
                : '',
            'person_notify_address' => $contactPerson?->address
                ? trim(implode(', ', array_filter([
                    $contactPerson->address->street ?? null,
                    'Brgy. ' . $contactPerson->address->brgy,
                    $contactPerson->address->city,
                    $contactPerson->address->province,
                    $contactPerson->address->zip_code,
                ])))
                : '',
            'person_notify_cellphone' => $contactPerson?->mobile_num ? "0" . $contactPerson->mobile_num : '',
            'mother_highest_educational_attainment' => $student->guardians->where('role', 'Mother')->first()?->highest_educ_attainment,
            'father_highest_educational_attainment' => $student->guardians->where('role', 'Father')->first()?->highest_educ_attainment,
            'first_gen_student' => (int) $student->answers()
                ->where('question_id', 6)
                ->where('answer_boolean', true)
                ->exists() ? "1" : "0",
            'ip_or_icc' => (int) $student->answers()
                ->where('question_id', 7)
                ->where('answer_boolean', true)
                ->exists() ? "1" : "0",
            'ip_or_icc_yes' => (int) $student->answers()
                ->where('question_id', 7)
                ->where('answer_boolean', true)
                ->exists() ? "1" : "0",
            'shs_school_type' => $student->educations->where('education_level', 'Senior High School')->first()?->school_type ?? '',
            'college_school_type' => $student->educations->where('education_level', 'College')->first()?->school_type ?? '',
        ];
    }

    public function exportCsv(ExportStudentsRequest $request)
    {
        try {
            $students = $this->studentRepo->export($request->all());

            if ($students->isEmpty()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No students found'
                ], 400);
            }

            $students->load([
                'guardians.address',
                'address',
                'educations',
                'answers',
            ]);

            ActivityLog::log('export', 'Exported (' . count($students) . ') students data as CSV by campus', Auth::user()->email, request(), 'success');

            $columns = [
                'email',
                'campus',
                'student_lastname',
                'student_firstname',
                'student_middlename',
                'extension',
                'birthdate',
                'gender',
                'birthplace',
                'street',
                'barangay',
                'city',
                'zip_code',
                'civilstatus',
                'religion',
                'contact_number',
                'mother_lastname',
                'mother_firstname',
                'mother_middlename',
                'mother_occupation',
                'father_lastname',
                'father_firstname',
                'father_middlename',
                'father_occupation',
                'year_admitted',
                'semester',
                'year',
                'curriculum',
                'lrn_no',
                'e_name_of_school',
                'e_address_of_school',
                'e_school_year_attended',
                's_name_of_school',
                's_address_of_school',
                's_school_year_attended',
                'shs_name_of_school',
                'shs_address_of_school',
                'shs_school_year_attended',
                'c_name_of_school',
                'c_address_of_school',
                'c_school_year_attended',
                'g_name_of_school',
                'g_address_of_school',
                'g_school_year_attended',
                'scholarship_title',
                'scholarship_contactperson',
                'scholarship_address',
                'scholarship_contactnumber',
                'person_notify_name',
                'person_notify_address',
                'person_notify_cellphone',
                'mother_highest_educational_attainment',
                'father_highest_educational_attainment',
                'first_gen_student',
                'ip_or_icc',
                'ip_or_icc_yes',
                'shs_school_type',
                'college_school_type',
            ];

            // Canonical campus list -> normalize whatever casing is stored on the student
            $campusMap = [
                'talisay' => 'Talisay',
                'alijis' => 'Alijis',
                'fortune towne' => 'Fortune Towne',
                'binalbagan' => 'Binalbagan',
            ];

            // Group students by normalized campus name; anything unmatched goes into "Others"
            $grouped = $students->groupBy(function ($student) use ($campusMap) {
                $key = strtolower(trim($student->campus ?? ''));
                return $campusMap[$key] ?? 'Others';
            });

            $tmpDir = storage_path('app/tmp_csv_export_' . uniqid());
            mkdir($tmpDir, 0755, true);

            $zipFilename = 'students_by_campus_' . now()->timestamp . '.zip';
            $zipPath = storage_path('app/' . $zipFilename);

            $zip = new \ZipArchive();
            $zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE);

            foreach ($grouped as $campusName => $campusStudents) {
                $csvPath = $tmpDir . '/' . str_replace(' ', '_', $campusName) . '.csv';
                $file = fopen($csvPath, 'w');

                // BOM so Excel opens UTF-8 correctly
                fwrite($file, "\xEF\xBB\xBF");
                fputcsv($file, $columns);

                foreach ($campusStudents as $student) {
                    $row = $this->mapStudentToRecordRow($student);
                    fputcsv($file, array_map(fn($col) => $row[$col] ?? '', $columns));
                }

                fclose($file);

                $zip->addFile($csvPath, basename($csvPath));
            }

            $zip->close();

            // Clean up the loose CSV files, keep the zip
            array_map('unlink', glob($tmpDir . '/*.csv'));
            rmdir($tmpDir);

            return response()->download($zipPath, $zipFilename)->deleteFileAfterSend(true);
        } catch (Exception $e) {
            Log::error("Failed to export students csv by campus: " . $e->getMessage());

            ActivityLog::log('export', 'Failed to export students csv by campus: ' . $e->getMessage(), Auth::user()->email, request(), 'failed');

            return response()->json([
                'status' => 'error',
                'message' => 'Something went wrong'
            ], 500);
        }
    }
}

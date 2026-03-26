<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdditionalInfoRequest;
use App\Http\Requests\EducationInfoRequest;
use App\Http\Requests\FamilyInfoRequest;
use App\Http\Requests\StudentAddressInfo;
use App\Http\Requests\StudentContactAddressInfo;
use App\Http\Requests\StudentInfoRequest;
use App\Http\Requests\StudentStoreRequest;
use App\Jobs\StoreStudentSubmission;
use App\Models\EntityDropdown;
use App\Repositories\AcademicYearAndSemesterRepo;
use App\Repositories\AnswerRepo;
use App\Repositories\GuardianRepo;
use App\Repositories\QuestionRepo;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected StudentRepo $studentRepo, protected QuestionRepo $questionRepo, protected AcademicYearAndSemesterRepo $academicYearAndSemesterRepo, protected GuardianRepo $guardianRepo, protected AnswerRepo $answerRepo)
    {
    }

    public function index()
    {
        $questions = $this->questionRepo->getActive();
        $academic_year_and_semester = $this->academicYearAndSemesterRepo->getLatest();

        return Inertia::render('Student/Index', [
            'questions' => $questions,
            'academic_year_and_semester' => $academic_year_and_semester,
            'dropdowns' => EntityDropdown::all()
        ]);
    }

    public function create()
    {
        //
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


    /**
     * Store a newly created resource in storage.
     */
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

            return back()->with('error', 'Something went wrong, please try again' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

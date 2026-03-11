<?php

namespace App\Http\Controllers;

use App\Http\Requests\AdditionalInfoRequest;
use App\Http\Requests\EducationInfoRequest;
use App\Http\Requests\FamilyInfoRequest;
use App\Http\Requests\StudentContactAddressInfo;
use App\Http\Requests\StudentInfoRequest;
use App\Http\Requests\StudentStoreRequest;
use App\Jobs\StoreStudentSubmission;
use App\Repositories\AcademicYearAndSemesterRepo;
use App\Repositories\QuestionRepo;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function __construct(protected StudentRepo $studentRepo, protected QuestionRepo $questionRepo, protected AcademicYearAndSemesterRepo $academicYearAndSemesterRepo)
    {
    }

    public function index()
    {
        $student = $this->studentRepo->find(1);
        $questions = $this->questionRepo->getActive();
        $academic_year_and_semester = $this->academicYearAndSemesterRepo->getLatest();

        return Inertia::render('Student/Index', [
            'questions' => $questions,
            'academic_year_and_semester' => $academic_year_and_semester,
            'student' => $student
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

    public function validateStudentContactAddress(StudentContactAddressInfo $request)
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

            StoreStudentSubmission::dispatch($request->all());

            return Inertia::render('Student/Index', ['success' => true]);


        } catch (Exception $e) {

            return back()->with('error', 'Something went wrong, please try again');

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

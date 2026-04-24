<?php

namespace App\Http\Controllers;

use App\Models\AcademicYearAndSemester;
use App\Repositories\StudentRepo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected StudentRepo $studentRepo)
    {

    }
    public function index()
    {
        $academicYearAndSemester = AcademicYearAndSemester::first();
        $studentsCountPerCampus = $this->studentRepo->getStudentsCountPerCampus();
        $latestStudents = $this->studentRepo->getLatestStudents();

        return Inertia::render('Admin/Dashboard/Index', [
            'academic_year_and_semester' => $academicYearAndSemester,
            'latestStudents' => $latestStudents,
            'studentsCountPerCampus' => $studentsCountPerCampus
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\AcademicYearAndSemester;
use App\Repositories\StudentRepo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __construct(protected StudentRepo $studentRepo)
    {

    }
    public function index()
    {
        $academicYearAndSemester = AcademicYearAndSemester::first();

        $latestStudents = $this->studentRepo->getLatestStudents();

        return Inertia::render('dashboard', [
            'academic_year_and_semester' => $academicYearAndSemester,
            'latestStudents' => $latestStudents
        ]);
    }
}

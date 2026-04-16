<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcademicYearAndSemesterRequest;
use App\Http\Requests\UpdateAcademicYearAndSemesterRequest;
use App\Models\AcademicYearAndSemester;
use Illuminate\Http\Request;

class AcademicYearAndSemesterController extends Controller
{
    public function update(UpdateAcademicYearAndSemesterRequest $request)
    {
        $academicYearAndSemester = AcademicYearAndSemester::first();



        $academic_year = $request->input('academic_year_from') . '-' . $request->input('academic_year_to');
        $semester = $request->input('semester');

        $academicYearAndSemester->update([
            'academic_year' => $academic_year,
            'semester' => $semester,
        ]);
        return back()->with('success', 'Academic Year and Semester updated successfully');
    }
}

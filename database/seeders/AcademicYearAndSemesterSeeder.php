<?php

namespace Database\Seeders;

use App\Models\AcademicYearAndSemester;
use Illuminate\Database\Seeder;

class AcademicYearAndSemesterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get or create an academic year
        AcademicYearAndSemester::firstOrCreate([
            'academic_year' => '2026-2027',
            'semester' => '1st Semester',
        ]);
    }
}

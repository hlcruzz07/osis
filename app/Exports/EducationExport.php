<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class EducationExport implements FromArray, WithHeadings
{
    protected $education;

    public function __construct($education)
    {
        $this->education = $education;
    }

    public function array(): array
    {
        $data = [];

        foreach ($this->education ?? [] as $edu) {
            $data[] = [
                $edu->education_level ?? '',
                $edu->school_name ?? '',
                $edu->school_address ?? '',
                $edu->school_type ?? '',
                $edu->year_graduated ?? '',
                $edu->general_average ?? '',
                $edu->strand ?? '',
                $edu->course ?? '',
                $edu->academic_year ?? '',
                $edu->scholarship_program ?? '',
                $edu->scholarship_address ?? '',
                $edu->scholarship_mobile_num ?? '',
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'Education Level',
            'School Name',
            'School Address',
            'School Type',
            'Year Graduated',
            'General Average',
            'Strand',
            'Course',
            'Academic Year',
            'Scholarship Program',
            'Scholarship Address',
            'Scholarship Mobile Number'
        ];
    }
}
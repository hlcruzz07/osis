<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class StudentExport implements FromArray, WithHeadings
{
    protected $student;

    public function __construct($student)
    {
        $this->student = (object) $student; // ✅ ensures object access
    }

    public function array(): array
    {
        return [
            [
                $this->student->academic_year ?? '',
                $this->student->semester ?? '',
                $this->student->lrn ?? '',
                $this->student->year_level ?? '',
                $this->student->campus ?? '',
                $this->student->course ?? '',
                $this->student->date_admitted ?? '',
                $this->student->student_type ?? '',
                $this->student->equity_indicator ?? '',
                $this->student->fname ?? '',
                $this->student->mname ?? '',
                $this->student->lname ?? '',
                $this->student->suffix ?? '',
                $this->student->birthdate ?? '',
                $this->student->birthplace ?? '',
                $this->student->weekly_allowance ?? '',
                $this->student->financer ?? '',
                $this->student->last_attended_school ?? '',
                $this->student->email ?? '',
                $this->student->mobile_num ?? '',
                $this->student->religion ?? '',
                $this->student->citizenship ?? '',
                $this->student->civil_status ?? '',
                $this->student->sexual_orient ?? '',
                $this->student->height ?? '',
                $this->student->weight ?? '',

            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Academic Year',
            'Semester',
            'LRN',
            'Year Level',
            'Campus',
            'Course',
            'Date Admitted',
            'Student Type',
            'Equity Indicator',
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Birthdate',
            'Birthplace',
            'Weekly Allowance',
            'Financer',
            'Last Attended School',
            'Email',
            'Mobile Number',
            'Religion',
            'Citizenship',
            'Civil Status',
            'Sexual Orientation',
            'Height',
            'Weight',

        ];
    }
}
<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class GuardiansExport implements FromArray, WithHeadings
{
    protected $guardians;

    public function __construct($guardians)
    {
        $this->guardians = $guardians;
    }

    public function array(): array
    {
        $data = [];

        foreach ($this->guardians ?? [] as $g) {


            $g = (object) $g;

            $address = isset($g->address) ? (object) $g->address : null;

            $data[] = [
                $g->fname ?? '',
                $g->mname ?? '',
                $g->lname ?? '',
                $g->suffix ?? '',
                $g->role ?? '',
                $g->birthdate ?? '',
                $g->birthplace ?? '',
                $g->mobile_num ?? '',
                $g->religion ?? '',
                $g->citizenship ?? '',
                $g->highest_educ_attainment ?? '',
                $g->life_status ?? '',
                $g->cause_of_death ?? '',
                $g->year_of_death ?? '',
                $g->occupation ?? '',
                !empty($g->is_contact_person) ? 'Yes' : 'No',
                $address->region ?? '',
                $address->province ?? '',
                $address->city ?? '',
                $address->brgy ?? '',
                $address->zip_code ?? '',
            ];
        }

        return $data;
    }

    public function headings(): array
    {
        return [
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Relationship',
            'Birthdate',
            'Birthplace',
            'Mobile Number',
            'Religion',
            'Citizenship',
            'Highest Educational Attainment',
            'Life Status',
            'Cause of Death',
            'Year of Death',
            'Occupation',
            'Contact Person',
            'Region',
            'Province',
            'City',
            'brgy',
            'Zip Code',
        ];
    }
}
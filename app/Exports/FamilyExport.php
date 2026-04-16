<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class FamilyExport implements FromArray, WithHeadings
{
    protected $family;

    public function __construct($family)
    {
        $this->family = $family;
    }

    public function array(): array
    {
        if (!$this->family) {
            return [[null, null, null, null]];
        }

        return [
            [
                $this->family->family_size ?? '',
                $this->family->parent_martial_status ?? '',
                $this->family->nature_residence ?? '',
                $this->family->house_monthly_income ?? '',
                $this->family->ordinal_position ?? '',
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Family Size',
            "Parent's Martial Status",
            'Nature of Residence',
            'Household Monthly Income',
            'Ordinal Position',
        ];
    }
}
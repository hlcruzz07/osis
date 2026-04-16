<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class SiblingsExport implements FromArray, WithHeadings
{
    protected $siblings;

    public function __construct($siblings)
    {
        $this->siblings = $siblings;
    }

    public function array(): array
    {
        $data = [];

        foreach ($this->siblings ?? [] as $s) {
            $data[] = [
                $s->fname ?? '',
                $s->mname ?? '',
                $s->lname ?? '',
                $s->suffix ?? '',
                $s->is_attending_college ? 'Yes' : 'No',
                $s->is_employed ? 'Yes' : 'No',
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
            'Attending College',
            'Employed',
        ];
    }
}
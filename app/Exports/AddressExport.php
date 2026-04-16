<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class AddressExport implements FromArray, WithHeadings
{
    protected $address;

    public function __construct($address)
    {
        $this->address = $address;
    }

    public function array(): array
    {
        if (!$this->address) {
            return [[null, null, null, null]];
        }

        return [
            [
                $this->address->province ?? '',
                $this->address->city ?? '',
                $this->address->brgy ?? '',
                $this->address->zip_code ?? '',
            ]
        ];
    }

    public function headings(): array
    {
        return [
            'Province',
            'City',
            'Barangay',
            'Zip Code'
        ];
    }
}
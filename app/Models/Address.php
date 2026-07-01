<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    protected $fillable = [
        'student_id',
        'guardian_id',
        'island',
        'region',
        'province',
        'city',
        'brgy',
        'zip_code',
        'street',

        'island_hash',
        'region_hash',
        'province_hash',
        'city_hash',
        'brgy_hash',
        'zip_code_hash',
        'street_hash',
    ];


    protected $casts =
        [
            'island' => 'encrypted',
            'region' => 'encrypted',
            'province' => 'encrypted',
            'city' => 'encrypted',
            'brgy' => 'encrypted',
            'zip_code' => 'encrypted',
            'street' => 'encrypted',
        ];
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function guardian()
    {
        return $this->belongsTo(Guardian::class, 'guardian_id');
    }
}

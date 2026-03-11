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
    ];


    protected $casts =
        [
            'island' => 'encrypted',
            'region' => 'encrypted',
            'province' => 'encrypted',
            'city' => 'encrypted',
            'brgy' => 'encrypted',
            'zip_code' => 'encrypted',
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

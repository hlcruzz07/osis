<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicYearAndSemester extends Model
{
    protected $fillable = [
        'academic_year',
        'semester',
        'academic_year_hash',
        'semester_hash'
    ];

    protected $casts = [
        'academic_year' => 'encrypted',
        'semester' => 'encrypted'
    ];


}

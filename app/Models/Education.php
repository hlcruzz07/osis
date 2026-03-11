<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $fillable = [
        'student_id',
        'education_level',
        'school_name',
        'school_address',
        'school_type',
        'year_graduated',
        'general_average',
        'course',
        'academic_year',
        'scholarship_program',
        'scholarship_address',
        'scholarship_mobile_num',
    ];
    protected $casts =
        [
            'education_level' => 'encrypted',
            'school_name' => 'encrypted',
            'school_address' => 'encrypted',
            'school_type' => 'encrypted',
            'year_graduated' => 'encrypted',
            'general_average' => 'encrypted',
            'course' => 'encrypted',
            'academic_year' => 'encrypted',
            'scholarship_program' => 'encrypted',
            'scholarship_address' => 'encrypted',
            'scholarship_mobile_num' => 'encrypted',
        ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}

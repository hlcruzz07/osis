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


    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}

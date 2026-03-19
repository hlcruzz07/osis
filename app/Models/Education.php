<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $fillable = [
        // Original fields
        'student_id',
        'education_level',
        'school_name',
        'school_address',
        'school_type',
        'year_graduated',
        'general_average',
        'strand',
        'course',
        'academic_year',
        'scholarship_program',
        'scholarship_address',
        'scholarship_mobile_num',

        // Hash fields
        'education_level_hash',
        'school_name_hash',
        'school_address_hash',
        'school_type_hash',
        'year_graduated_hash',
        'general_average_hash',
        'strand_hash',
        'course_hash',
        'academic_year_hash',
        'scholarship_program_hash',
        'scholarship_address_hash',
        'scholarship_mobile_num_hash',
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
            'strand' => 'encrypted',
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

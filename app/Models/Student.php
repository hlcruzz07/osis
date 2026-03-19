<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'academic_year',
        'semester',
        'lrn',
        'year_level',
        'campus',
        'course',
        'date_admitted',
        'student_type',
        'equity_indicator',
        'fname',
        'mname',
        'lname',
        'suffix',
        'birthdate',
        'birthplace',
        'weekly_allowance',
        'financer',
        'last_attended_school',
        'email',
        'mobile_num',
        'religion',
        'citizenship',
        'civil_status',
        'sexual_orient',
        'height',
        'weight',
        'family_size',
        'nature_residence',
        'house_monthly_income',
        'ordinal_position',

        'academic_year_hash',
        'semester_hash',
        'lrn_hash',
        'year_level_hash',
        'campus_hash',
        'course_hash',
        'date_admitted_hash',
        'student_type_hash',
        'equity_indicator_hash',
        'fname_hash',
        'mname_hash',
        'lname_hash',
        'suffix_hash',
        'birthdate_hash',
        'birthplace_hash',
        'weekly_allowance_hash',
        'financer_hash',
        'last_attended_school_hash',
        'email_hash',
        'mobile_num_hash',
        'religion_hash',
        'citizenship_hash',
        'civil_status_hash',
        'sexual_orient_hash',
        'height_hash',
        'weight_hash',
        'family_size_hash',
        'nature_residence_hash',
        'house_monthly_income_hash',
        'ordinal_position_hash',
    ];
    protected $casts
        = [
            'academic_year' => 'encrypted',
            'semester' => 'encrypted',
            'lrn' => 'encrypted',
            'year_level' => 'encrypted',
            'campus' => 'encrypted',
            'course' => 'encrypted',
            'date_admitted' => 'encrypted',
            'student_type' => 'encrypted',
            'equity_indicator' => 'encrypted',
            'fname' => 'encrypted',
            'mname' => 'encrypted',
            'lname' => 'encrypted',
            'suffix' => 'encrypted',
            'birthdate' => 'encrypted',
            'birthplace' => 'encrypted',
            'weekly_allowance' => 'encrypted',
            'financer' => 'encrypted',
            'last_attended_school' => 'encrypted',
            'email' => 'encrypted',
            'mobile_num' => 'encrypted',
            'religion' => 'encrypted',
            'citizenship' => 'encrypted',
            'civil_status' => 'encrypted',
            'sexual_orient' => 'encrypted',
            'height' => 'encrypted',
            'weight' => 'encrypted',
            'family_size' => 'encrypted',
            'nature_residence' => 'encrypted',
            'house_monthly_income' => 'encrypted',
            'ordinal_position' => 'encrypted',
        ];


    public function guardians()
    {
        return $this->hasMany(Guardian::class, 'student_id');
    }

    public function address()
    {
        return $this->hasOne(Address::class, 'student_id');
    }

    public function educations()
    {
        return $this->hasMany(Education::class, 'student_id');
    }

    public function siblings()
    {
        return $this->hasMany(Sibling::class, 'student_id');
    }

    public function answers()
    {
        return $this->hasMany(StudentAnswer::class, 'student_id');
    }

    public function subAnswers()
    {
        return $this->hasMany(StudentSubAnswer::class, 'student_id');
    }

}

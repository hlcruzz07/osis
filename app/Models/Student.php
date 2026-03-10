<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
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

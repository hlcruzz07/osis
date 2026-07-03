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
        'ref_number',
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
        'citizenship',
        'civil_status',
        'religion',
        'sexual_orient',
        'height',
        'weight',
        'status',
        'major',
        'major_hash',
        'gender',
        'gender_hash',
        'section',
        'section_hash',

        'social_media_account',
        'social_media_account_hash',

        'scholarship_program',
        'scholarship_program_hash',

        'scholarship_address',
        'scholarship_address_hash',

        'scholarship_contact',
        'scholarship_contact_hash',
        'is_complete_scholarship',
        'remarks',
        'remarks_hash',
        'nationality',
        'nationality_hash',
        'current_address',
        'current_address_hash',

        'academic_year_hash',
        'semester_hash',
        'lrn_hash',
        'year_level_hash',
        'ref_number_hash',
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
        'status_hash'

    ];
    protected $casts
        = [
            'academic_year' => 'encrypted',
            'semester' => 'encrypted',
            'lrn' => 'encrypted',
            'year_level' => 'encrypted',
            'ref_number' => 'encrypted',
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
            'status' => 'encrypted',
            'major' => 'encrypted',
            'social_media_account' => 'encrypted',
            'is_complete_scholarship' => 'boolean',
            'nationality' => 'encrypted',
            'current_address' => 'encrypted'

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

    public function familyInfo()
    {
        return $this->hasOne(FamilyInfo::class, 'student_id');
    }

    public function answers()
    {
        return $this->hasMany(StudentAnswer::class, 'student_id');
    }

    public function subAnswers()
    {
        return $this->hasMany(StudentSubAnswer::class, 'student_id');
    }

    public function scholarships()
    {
        return $this->hasMany(Scholarship::class, 'student_id');
    }

    public function psychTests()
    {
        return $this->hasMany(PsychTest::class, 'student_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    protected $fillable = [
        'student_id',
        'fname',
        'mname',
        'lname',
        'suffix',
        'role',
        'birthdate',
        'birthplace',
        'mobile_num',
        'religion',
        'citizenship',
        'highest_educ_attainment',
        'life_status',
        'cause_of_death',
        'year_of_death',
        'occupation',
        'is_contact_person',
    ];


    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function address()
    {
        return $this->hasOne(Address::class, 'guardian_id');
    }
}

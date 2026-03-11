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

    protected $casts = [
        'fname' => 'encrypted',
        'mname' => 'encrypted',
        'lname' => 'encrypted',
        'suffix' => 'encrypted',
        'role' => 'encrypted',
        'birthdate' => 'encrypted',
        'birthplace' => 'encrypted',
        'mobile_num' => 'encrypted',
        'religion' => 'encrypted',
        'citizenship' => 'encrypted',
        'highest_educ_attainment' => 'encrypted',
        'life_status' => 'encrypted',
        'cause_of_death' => 'encrypted',
        'year_of_death' => 'encrypted',
        'occupation' => 'encrypted',
        'is_contact_person' => 'boolean',
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

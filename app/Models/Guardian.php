<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    protected $fillable = [
        // Original fields
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

        // Hash fields
        'fname_hash',
        'mname_hash',
        'lname_hash',
        'suffix_hash',
        'role_hash',
        'birthdate_hash',
        'birthplace_hash',
        'mobile_num_hash',
        'religion_hash',
        'citizenship_hash',
        'highest_educ_attainment_hash',
        'life_status_hash',
        'cause_of_death_hash',
        'year_of_death_hash',
        'occupation_hash',
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

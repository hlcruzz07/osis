<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sibling extends Model
{
    protected $fillable = [
        'student_id',
        'fname',
        'mname',
        'lname',
        'suffix',
        'is_attending_college',
        'is_employed',

        'fname_hash',
        'mname_hash',
        'lname_hash',
        'suffix_hash',
    ];

    protected $casts = [
        'fname' => 'encrypted',
        'mname' => 'encrypted',
        'lname' => 'encrypted',
        'suffix' => 'encrypted',
        'is_attending_college' => 'boolean',
        'is_employed' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}

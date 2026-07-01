<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Scholarship extends Model
{
    protected $fillable = [
        'name',
        'name_hash',
        'type',
        'type_hash'
    ];

    protected $casts = [
        'name' => 'encrypted',
        'type' => 'encrypted'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}

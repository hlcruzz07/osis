<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PsychTest extends Model
{
    protected $fillable = [
        'student_id',
        'date_taken',
        'date_taken_hash',
        'name',
        'name_hash',
        'result',
        'result_hash',
        'interpretation',
        'interpretation_hash'
    ];

    protected $casts = [
        'date_taken' => 'encrypted',
        'name' => 'encrypted',
        'result' => 'encrypted',
        'interpretation' => 'encrypted'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}

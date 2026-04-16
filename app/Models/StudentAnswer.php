<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAnswer extends Model
{
    protected $fillable = [
        'question_id',
        'student_id',
        'answer_text',
        'answer_number',
        'answer_date',
        'answer_boolean',
    ];


    protected $casts = [
        'answer_date' => 'datetime',
        'answer_boolean' => 'boolean',
    ];


    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }
}

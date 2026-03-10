<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentSubAnswer extends Model
{
    protected $fillable = [
        'sub_question_id',
        'student_id',
        'answer_text',
        'answer_number',
        'answer_date',
        'answer_boolean',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function subQuestion()
    {
        return $this->belongsTo(SubQuestion::class, 'sub_question_id');
    }
}

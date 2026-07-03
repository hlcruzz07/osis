<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnswerAttachment extends Model
{
    protected $fillable = [
        'student_answer_id',
        'img'
    ];

    public function studentAnswer()
    {
        return $this->belongsTo(StudentAnswer::class, 'student_answer_id');
    }
}

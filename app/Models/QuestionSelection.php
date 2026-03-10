<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestionSelection extends Model
{
    protected $fillable = [
        'question_id',
        'sub_question_id',
        'item'
    ];

    public function selectQuestion()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function selectSubQuestion()
    {
        return $this->belongsTo(SubQuestion::class, 'sub_question_id');
    }
}

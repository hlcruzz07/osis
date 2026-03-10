<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'user_id',
        'question',
        'answer_type'
    ];

    public function subQuestions()
    {
        return $this->hasMany(SubQuestion::class, 'question_id');
    }

    public function selectItems()
    {
        return $this->hasMany(QuestionSelection::class, 'question_id');
    }
}

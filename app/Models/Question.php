<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'user_id',
        'question',
        'answer_type',
        'sub_expected_answer',
        'is_required',
        'is_deleted',
    ];

    protected $casts = [
        'question' => 'encrypted',
        'is_required' => 'boolean',
        'is_deleted' => 'boolean',
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

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubQuestion extends Model
{
    protected $fillable = [
        'question_id',
        'sub_question',
        'answer_type',
        'is_required',
        'is_deleted',
    ];

    protected $casts =
        [
            'is_required' => 'boolean',
            'is_deleted' => 'boolean',
        ];

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function selectItems()
    {
        return $this->hasMany(QuestionSelection::class, 'sub_question_id');
    }
}

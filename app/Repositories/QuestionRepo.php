<?php

namespace App\Repositories;

use App\Models\Question;

class QuestionRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Question $model)
    {
    }

    protected function hashValue(?string $value): ?string
    {
        if (is_null($value) || $value === '') {
            return null;
        }
        return hash('sha256', $value);
    }

    public function store(array $data): Question
    {
        return $this->model->create([
            'question' => $data['question'],
            'question_hash' => $this->hashValue($data['question'] ?? null),
            'answer_type' => $data['answer_type'] ?? null,
            'answer_type_hash' => $this->hashValue($data['answer_type'] ?? null),
            'sub_expected_answer' => $data['sub_expected_answer'] ?? null,
            'sub_expected_answer_hash' => $this->hashValue($data['sub_expected_answer'] ?? null),
            'is_required' => $data['is_required'] ?? false,
            'is_active' => $data['is_active'] ?? true,
            'academic_year_id' => $data['academic_year_id'] ?? null,
        ]);
    }

    public function all()
    {
        return $this->model->with(['subQuestions.selectItems', 'selectItems'])->get();
    }

    public function getActive()
    {
        return $this->model
            ->with([
                'subQuestions' => function ($query) {
                    $query->where('is_deleted', false);
                },
                'subQuestions.selectItems',
                'selectItems'
            ])
            ->where('is_active', true)
            ->where('is_deleted', false)
            ->get();
    }
}

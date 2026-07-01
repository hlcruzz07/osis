<?php

namespace App\Repositories;

use App\Models\StudentAnswer;
use App\Models\StudentSubAnswer;
use Carbon\Carbon;

class AnswerRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected StudentAnswer $studentAnswer, protected StudentSubAnswer $studentSubAnswer)
    {
    }

    protected function hashValue(?string $value): ?string
    {
        if (is_null($value) || $value === '') {
            return null;
        }
        return hash('sha256', $value);
    }

    public function storeAnswers(array $data, int $id)
    {
        foreach ($data as $item) {

            $this->studentAnswer->updateOrCreate(
                [
                    'student_id' => $id,
                    'question_id' => $item['question_id'],
                ],
                [
                    'answer_text' => $item['answer_type'] === 'text' ? $item['answer'] : null,
                    'answer_number' => $item['answer_type'] === 'number' ? $item['answer'] : null,
                    'answer_date' => $item['answer_type'] === 'date' ? $item['answer'] : null,
                    'answer_boolean' => $item['answer_type'] === 'boolean' ? $item['answer'] : null,
                ]
            );
        }

    }


    public function storeSubAnswers(array $data, int $id)
    {
        foreach ($data as $item) {

            $this->studentSubAnswer->updateOrCreate(
                [
                    'sub_question_id' => $item['sub_question_id'],
                    'student_id' => $id,
                ],
                [
                    'answer_text' => $item['answer_type'] === 'text' ? $item['answer'] : null,
                    'answer_number' => $item['answer_type'] === 'number' ? $item['answer'] : null,
                    'answer_date' => $item['answer_type'] === 'date' ? $item['answer'] : null,
                    'answer_boolean' => $item['answer_type'] === 'boolean' ? $item['answer'] : null,
                ]
            );
        }
    }

    public function updateAnswers(array $data, int $id)
    {
        foreach ($data as $item) {

            $this->studentAnswer->updateOrCreate(
                [
                    'student_id' => $id,
                    'question_id' => $item['question_id'],
                ],
                [
                    'answer_text' => $item['answer_type'] === 'text' ? $item['answer'] : null,
                    'answer_number' => $item['answer_type'] === 'number' ? $item['answer'] : null,
                    'answer_date' => $item['answer_type'] === 'date' ? $item['answer'] : null,
                    'answer_boolean' => $item['answer_type'] === 'boolean' ? $item['answer'] : null,
                ]
            );
        }
    }

    public function updateSubAnswers(array $data, int $id)
    {
        foreach ($data as $item) {

            $this->studentSubAnswer->updateOrCreate(
                [
                    'sub_question_id' => $item['sub_question_id'],
                    'student_id' => $id,
                ],
                [
                    'answer_text' => $item['answer_type'] === 'text' ? $item['answer'] : null,
                    'answer_number' => $item['answer_type'] === 'number' ? $item['answer'] : null,
                    'answer_date' => $item['answer_type'] === 'date' ? $item['answer'] : null,
                    'answer_boolean' => $item['answer_type'] === 'boolean' ? $item['answer'] : null,
                ]
            );
        }
    }
}

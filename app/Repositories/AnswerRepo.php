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

    public function storeAnswers(array $data, int $id)
    {
        $now = Carbon::now();

        $final_data = collect($data)->map(function ($item) use ($id, $now) {

            return [
                'question_id' => $item['question_id'],
                'student_id' => $id,
                'answer_text' => $item['answer_type'] === 'text' ? $item['answer'] : null,
                'answer_number' => $item['answer_type'] === 'number' ? $item['answer'] : null,
                'answer_date' => $item['answer_type'] === 'date' ? $item['answer'] : null,
                'answer_boolean' => $item['answer_type'] === 'boolean' ? $item['answer'] : null,
                'created_at' => $now,
                'updated_at' => $now,
            ];

        })->toArray();

        $this->studentAnswer->insert($final_data);

    }


    public function storeSubAnswers(array $data, int $id)
    {
        $now = Carbon::now();

        $final_data = collect($data)->map(function ($item) use ($id, $now) {

            return [
                'sub_question_id' => $item['sub_question_id'],
                'student_id' => $id,
                'answer_text' => $item['answer_type'] === 'text' ? $item['answer'] : null,
                'answer_number' => $item['answer_type'] === 'number' ? $item['answer'] : null,
                'answer_date' => $item['answer_type'] === 'date' ? $item['answer'] : null,
                'answer_boolean' => $item['answer_type'] === 'boolean' ? $item['answer'] : null,
                'created_at' => $now,
                'updated_at' => $now,
            ];

        })->toArray();

        $this->studentSubAnswer->insert($final_data);
    }
}

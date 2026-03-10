<?php

namespace App\Http\Requests;

use App\Models\Question;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdditionalInfoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'answers' => ['required', 'array'],
            'answers.*.question_id' => ['required', 'exists:questions,id'],
            'answers.*.sub_question_id' => ['nullable', 'exists:sub_questions,id'],
        ];

        $questions = Question::with('subQuestions')->get();

        foreach ($this->answers as $index => $answerRow) {

            $question = $questions->firstWhere('id', $answerRow['question_id']);

            if (!$question) {
                continue;
            }

            $isSub = !is_null($answerRow['sub_question_id']);

            if (!$isSub) {
                $field = "answers.$index.answer";

                $questionRules = [];

                if ($question->is_required) {
                    $questionRules[] = 'required';
                } else {
                    $questionRules[] = 'nullable';
                }

                if ($question->answer_type === 'boolean') {
                    $questionRules[] = 'boolean';
                }

                if ($question->answer_type === 'number') {
                    $questionRules[] = 'numeric';
                }

                $rules[$field] = $questionRules;
            } else {

                $sub = $question->subQuestions
                    ->firstWhere('id', $answerRow['sub_question_id']);

                if (!$sub) {
                    continue;
                }

                $field = "answers.$index.answer";

                $parentAnswer = collect($this->answers)
                    ->firstWhere(
                        fn($a) =>
                        $a['question_id'] == $question->id &&
                        $a['sub_question_id'] === null
                    )['answer'] ?? null;

                // Convert boolean to string 'true'/'false' for comparison
                if (is_bool($parentAnswer)) {
                    $parentAnswer = $parentAnswer ? 'true' : 'false';
                }

                $shouldRequire =
                    $sub->is_required &&
                    (
                        !$question->sub_expected_answer ||
                        strtolower((string)$parentAnswer) === strtolower((string)$question->sub_expected_answer)
                    );

                $rules[$field] = $shouldRequire ? ['required'] : ['nullable'];
            }
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'answers.*.answer.required' => 'This field is required.',
        ];
    }
}

<?php

namespace App\Http\Requests;

use App\Models\EntityDropdown;
use App\Models\Question;
use Illuminate\Foundation\Http\FormRequest;

class StoreScholarshipRequest extends FormRequest
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
                        strtolower((string) $parentAnswer) === strtolower((string) $question->sub_expected_answer)
                    );

                $rules[$field] = $shouldRequire ? ['required'] : ['nullable'];
            }
        }

        // Base scholarship rules
        $rules['scholarships'] = ['array'];
        $rules['scholarships.*.name'] = ['required', 'string', 'max:100'];
        $rules['scholarships.*.type'] = ['nullable', 'string', 'max:100'];

        // Pull the same scholarship definitions (name + allowed types) the
        // frontend uses, so we can conditionally require a type when the
        // scholarship the user picked actually has type options.
        //
        // NOTE: `dropdowns` is cast to `encrypted:array` on the model, so we
        // must fetch a hydrated model (first()) rather than using value(),
        // which runs a raw query builder call and skips Eloquent casts —
        // that would return the still-encrypted string instead of an array.
        $scholarshipDefinitions = collect(
            EntityDropdown::where('title', 'Scholarships')->first()?->dropdowns ?? []
        );

        foreach ($this->input('scholarships', []) as $index => $entry) {
            // `key` is the stable identifier the frontend sends (matches the
            // scholarship's original name, e.g. "Others"); fall back to
            // `name` in case `key` isn't present in the payload.
            $lookupKey = $entry['key'] ?? $entry['name'] ?? null;

            $definition = $scholarshipDefinitions->firstWhere('name', $lookupKey);

            $requiresType = $definition && count($definition['type'] ?? []) > 0;

            if ($requiresType) {
                $rules["scholarships.$index.type"] = ['required', 'string', 'max:100'];
            }
        }

        return array_merge($rules, [
            'student.year_level' => ['required', 'string', 'max:50'],
            'student.street' => ['required', 'string', 'max:150'],
            'student.social_media_account' => ['required', 'string', 'max:150'],
            'student.section' => ['required', 'string', 'max:10'],
            'student.house_monthly_income' => ['required', 'string'],
        ]);
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'scholarships.*.name.required' => 'Please specify the scholarship name.',
            'scholarships.*.type.required' => 'Please select a type for this scholarship.',

            'student.year_level.required' => 'Please select your year level.',
            'student.year_level.string' => 'Year level must be valid text.',
            'student.year_level.max' => 'Year level must not exceed :max characters.',

            'student.street.required' => 'Please enter your street.',
            'student.street.string' => 'Street must be valid text.',
            'student.street.max' => 'Street must not exceed :max characters.',

            'student.social_media_account.required' => 'Please enter your social media account.',
            'student.social_media_account.string' => 'Social media account must be valid text.',
            'student.social_media_account.max' => 'Social media account must not exceed :max characters.',

            'student.section.required' => 'Please enter your section.',
            'student.section.string' => 'Section must be valid text.',
            'student.section.max' => 'Section must not exceed :max characters.',

            'student.house_monthly_income.required' => 'Please select your household monthly income.',
            'student.house_monthly_income.string' => 'Household monthly income must be valid text.',
            'student.house_monthly_income.max' => 'Household monthly income must not exceed :max characters.',
        ];
    }
}
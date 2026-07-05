<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGuidanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $hasSiblings   = count($this->input('siblings', [])) > 0;
        $hasGuardians  = count($this->input('guardians', [])) > 0;
        $hasPsychTests = count($this->input('psych_tests', [])) > 0;

        return [
            // ── STUDENT ────────────────────────────────────────────────
            'student.student_type'         => 'required|string|max:50',
            'student.year_level'           => 'required|string|max:50',
            'student.section'              => 'required|string|max:50',
            'student.sexual_orient'        => 'required|string|max:50',
            'student.height'               => 'required|numeric|between:1,300',
            'student.weight'               => 'required|numeric|between:1,300',
            'student.nationality'          => 'required|string|max:100',
            'student.last_attended_school' => 'required|string|max:200',
            'student.current_address'      => 'required|string|max:500',
            'student.financer'             => 'required|string|max:100',
            'student.weekly_allowance'     => 'required|numeric|min:0|max:99999',

            // ── FAMILY ─────────────────────────────────────────────────
            'family.parent_martial_status' => 'required|string|max:50',
            'family.nature_residence'      => 'required|string|max:50',
            'family.house_monthly_income'  => 'required|string|max:100',
            'family.ordinal_position'      => 'required|string|max:50',

            // ── EDUCATIONS ─────────────────────────────────────────────
            'educations'                   => 'required|array|min:1',
            'educations.*.education_level' => 'required|string|max:50',
            'educations.*.school_name'     => 'required|string|max:150',
            'educations.*.school_address'  => 'required|string|max:250',
            'educations.*.school_type'     => 'required|string|max:50',
            'educations.*.general_average' => 'required|numeric|min:75|max:100',
            'educations.*.strand'          => 'nullable|string|max:50',
            'educations.*.honor_received'  => 'nullable|string|max:150',

            // ── SIBLINGS ───────────────────────────────────────────────
            'siblings'                        => 'array',
            'siblings.*.fname'                => [Rule::requiredIf($hasSiblings), 'string', 'max:150'],
            'siblings.*.mname'                => 'nullable|string|max:50',
            'siblings.*.lname'                => [Rule::requiredIf($hasSiblings), 'string', 'max:150'],
            'siblings.*.suffix'               => 'nullable|string|max:50',
            'siblings.*.gender'               => [Rule::requiredIf($hasSiblings), 'string', 'in:Male,Female'],
            'siblings.*.is_attending_college' => 'boolean',
            'siblings.*.is_employed'          => 'boolean',

            // ── GUARDIANS (pre-existing, simplified) ───────────────────
            'guardians'                  => 'array',
            'guardians.*.fname'          => [Rule::requiredIf($hasGuardians), 'string', 'max:50'],
            'guardians.*.mname'          => 'nullable|string|max:50',
            'guardians.*.lname'          => [Rule::requiredIf($hasGuardians), 'string', 'max:50'],
            'guardians.*.role'           => 'nullable|string|max:50',
            'guardians.*.birthplace'     => 'nullable|string|max:150',
            'guardians.*.citizenship'    => 'nullable|string|max:50',
            'guardians.*.religion'       => 'nullable|string|max:50',
            'guardians.*.life_status'    => 'nullable|string|max:50',
            'guardians.*.cause_of_death' => 'nullable|string|max:100',
            'guardians.*.year_of_death'  => 'nullable|digits:4',
            'guardians.*.occupation'     => 'nullable|string|max:100',

            // ── ANSWERS ────────────────────────────────────────────────
            'answers'                => 'array',
            'answers.*.question_id'  => 'required|integer|exists:questions,id',
            'answers.*.answer_type'  => 'required|string',
            'answers.*.answer'       => 'nullable',
            'answers.*.proof'        => 'nullable|array|max:2',
            'answers.*.proof.*'      => 'nullable|image|mimes:jpeg,jpg,png|max:1024',

            // ── PSYCH TESTS ────────────────────────────────────────────
            'psych_tests'                  => 'array',
            'psych_tests.*.name'           => [Rule::requiredIf($hasPsychTests), 'string', 'max:150'],
            'psych_tests.*.date_taken'     => [Rule::requiredIf($hasPsychTests), 'date'],
            'psych_tests.*.result'         => [Rule::requiredIf($hasPsychTests), 'string', 'max:255'],
            'psych_tests.*.interpretation' => 'required|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'student.student_type.required'         => 'Student type is required.',
            'student.year_level.required'           => 'Year level is required.',
            'student.section.required'              => 'Section is required.',
            'student.sexual_orient.required'        => 'Sexual orientation is required.',
            'student.height.required'               => 'Height is required.',
            'student.weight.required'               => 'Weight is required.',
            'student.nationality.required'          => 'Nationality is required.',
            'student.last_attended_school.required' => 'Last attended school is required.',
            'student.current_address.required'      => 'Current address is required.',
            'student.financer.required'             => 'Financer is required.',
            'student.weekly_allowance.required'     => 'Weekly allowance is required.',

            'family.parent_martial_status.required' => "Parent's marital status is required.",
            'family.nature_residence.required'      => 'Nature of residence is required.',
            'family.house_monthly_income.required'  => 'Household monthly income is required.',
            'family.ordinal_position.required'      => 'Birth order is required.',

            'educations.required'                   => 'Educational background is required.',
            'educations.*.school_name.required'     => 'School name is required.',
            'educations.*.school_address.required'  => 'School address is required.',
            'educations.*.school_type.required'     => 'School type is required.',
            'educations.*.year_graduated.required'  => 'Year graduated is required.',
            'educations.*.year_graduated.digits'    => 'Year graduated must be a 4-digit year.',
            'educations.*.general_average.required' => 'General average is required.',
            'educations.*.general_average.min'      => 'General average must be at least 75.',
            'educations.*.general_average.max'      => 'General average may not exceed 100.',

            'answers.*.question_id.exists'  => 'One or more questions are invalid.',
            'answers.*.proof.*.image'        => 'Proof must be an image file.',
            'answers.*.proof.*.mimes'        => 'Proof must be jpeg, jpg, png.',
            'answers.*.proof.*.max'          => 'Each proof image may not exceed 1mb.',
            'answers.*.proof.max'            => 'A maximum of 2 proof images are allowed per answer.',

            'psych_tests.*.name.required'       => 'Test name is required.',
            'psych_tests.*.date_taken.required' => 'Date taken is required.',
            'psych_tests.*.date_taken.date'     => 'Date taken must be a valid date.',
            'psych_tests.*.result.required'     => 'Test result is required.',
            'psych_tests.*.interpretation.required'     => 'Test interpretation is required.',
        ];
    }
}

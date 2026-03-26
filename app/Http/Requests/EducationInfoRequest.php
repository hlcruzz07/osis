<?php

namespace App\Http\Requests;

use App\Repositories\EntityDropdownRepo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EducationInfoRequest extends FormRequest
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
        $entity = new EntityDropdownRepo();

        $validSchoolType = $entity->getDropdownsByTitle("School Type");
        $isTransferee = $this->input('student.student_type') === 'Transferee';
        $hasCollege = !empty(array_filter((array) $this->input('education.college')));


        return [
            'educations.*.education_level' => 'required|in:Elementary,Junior High School,Senior High School,College',
            'educations.*.school_name' => 'required|max:150',
            'educations.*.school_address' => 'required|max:250',
            'educations.*.school_type' => ['required', Rule::in($validSchoolType)],
            'educations.*.year_graduated' => 'required|numeric|digits:4',
            'educations.*.general_average' => 'required|numeric|max:100|min:75',
            'educations.*.course' => 'nullable|max:50',
            'educations.*.strand' => 'nullable|max:50|required_if:educations.*.education_level,Senior High School',
            'educations.*.academic_year' => 'nullable',
            'educations.*.scholarship_program' => 'nullable|max:50',
            'educations.*.scholarship_address' => 'nullable|max:150',
            'educations.*.scholarship_mobile_num' => 'nullable|numeric|starts_with:9|digits:10',
        ];
    }

    public function messages(): array
    {
        return [
            'educations.*.education_level.required' => 'Education level is required.',
            'educations.*.education_level.in' => 'Education level must be Elementary, Junior High School, Senior High School, or College.',
            'educations.*.school_name.required' => 'School name is required.',
            'educations.*.school_name.max' => 'School name may not exceed 150 characters.',
            'educations.*.school_address.required' => 'School address is required.',
            'educations.*.school_address.max' => 'School address may not exceed 250 characters.',
            'educations.*.school_type.required' => 'School type is required.',
            'educations.*.school_type.in' => 'School type must be Public or Private.',
            'educations.*.year_graduated.required' => 'Year graduated is required.',
            'educations.*.year_graduated.numeric' => 'Year graduated must be a number.',
            'educations.*.year_graduated.digits' => 'Year graduated must be 4 digits.',
            'educations.*.general_average.required' => 'General average is required.',
            'educations.*.general_average.numeric' => 'General average must be a number.',
            'educations.*.general_average.min' => 'General average must be at least 75.',
            'educations.*.general_average.max' => 'General average may not exceed 100.',
            'educations.*.strand.required_if' => 'Strand is required.',
            'educations.*.strand.max' => 'The strand may not be greater than 50 characters.',
            'educations.*.course.max' => 'Course may not exceed 50 characters.',
            'educations.*.scholarship_program.max' => 'Scholarship program may not exceed 50 characters.',
            'educations.*.scholarship_address.max' => 'Scholarship address may not exceed 150 characters.',
            'educations.*.scholarship_mobile_num.numeric' => 'Scholarship mobile number must be numeric.',
            'educations.*.scholarship_mobile_num.starts_with' => 'Scholarship mobile number must start with 9.',
            'educations.*.scholarship_mobile_num.digits' => 'Scholarship mobile number must be exactly 10 digits.',
        ];
    }
}

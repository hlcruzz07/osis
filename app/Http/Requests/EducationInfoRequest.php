<?php

namespace App\Http\Requests;

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
        $isTransferee = $this->input('student.student_type') === 'Transferee';
        $hasCollege = !empty(array_filter((array) $this->input('education.college')));


        return [
            'education.elementary.education_level' => 'required|in:Elementary',
            'education.elementary.school_name' => 'required|max:150',
            'education.elementary.school_address' => 'required|max:250',
            'education.elementary.school_type' => 'required|in:Public,Private',
            'education.elementary.year_graduated' => 'required',
            'education.elementary.general_average' => 'required|numeric|max:100|min:75',

            'education.junior_high.education_level' => 'required|in:Junior Highschool',
            'education.junior_high.school_name' => 'required|max:150',
            'education.junior_high.school_address' => 'required|max:250',
            'education.junior_high.school_type' => 'required|in:Public,Private',
            'education.junior_high.year_graduated' => 'required',
            'education.junior_high.general_average' => 'required|numeric|max:100|min:75',

            'education.senior_high.education_level' => 'required|in:Senior Highschool',
            'education.senior_high.school_name' => 'required|max:150',
            'education.senior_high.school_address' => 'required|max:250',
            'education.senior_high.strand' => 'required|max:100',
            'education.senior_high.school_type' => 'required|in:Public,Private',
            'education.senior_high.year_graduated' => 'required',
            'education.senior_high.general_average' => 'required|numeric|max:100|min:75',

            'education.college.education_level' => [
                Rule::requiredIf($isTransferee || $hasCollege),
                'in:College'
            ],

            'education.college.school_name' => [
                Rule::requiredIf($isTransferee || $hasCollege),
                'max:150'
            ],

            'education.college.school_address' => [
                Rule::requiredIf($isTransferee || $hasCollege),
                'max:250'
            ],

            'education.college.school_type' => [
                Rule::requiredIf($isTransferee || $hasCollege),
                'in:Public,Private'
            ],

            'education.college.year_graduated' => [
                Rule::requiredIf($isTransferee || $hasCollege),
            ],

            'education.college.general_average' => [
                Rule::requiredIf($isTransferee || $hasCollege),
                'numeric',
                'min:75',
                'max:100'
            ],

            'education.college.course' => 'nullable|max:50',
            'education.college.academic_year' => 'nullable',
            'education.college.scholarship_program' => 'nullable|max:50',
            'education.college.scholarship_address' => 'nullable|max:150',
            'education.college.scholarship_mobile_num' => 'nullable|numeric|starts_with:9|digits:10',


        ];
    }

    public function messages(): array
    {
        return [


            'education.elementary.education_level.required' => 'Elementary education level is required.',
            'education.elementary.education_level.in' => 'Elementary education level must be Elementary.',

            'education.elementary.school_name.required' => 'Elementary school name is required.',
            'education.elementary.school_name.max' => 'Elementary school name may not exceed 150 characters.',

            'education.elementary.school_address.required' => 'Elementary school address is required.',
            'education.elementary.school_address.max' => 'Elementary school address may not exceed 250 characters.',

            'education.elementary.school_type.required' => 'Elementary school type is required.',
            'education.elementary.school_type.in' => 'Elementary school type must be Public or Private.',

            'education.elementary.year_graduated.required' => 'Elementary year graduated is required.',

            'education.elementary.general_average.required' => 'Elementary general average is required.',
            'education.elementary.general_average.numeric' => 'Elementary general average must be a number.',
            'education.elementary.general_average.min' => 'Elementary general average must be at least 75.',
            'education.elementary.general_average.max' => 'Elementary general average may not exceed 100.',

            'education.junior_high.education_level.required' => 'Junior High School education level is required.',
            'education.junior_high.education_level.in' => 'Junior High School education level must be Junior Highschool.',

            'education.junior_high.school_name.required' => 'Junior High School name is required.',
            'education.junior_high.school_address.required' => 'Junior High School address is required.',
            'education.junior_high.school_type.required' => 'Junior High School type is required.',
            'education.junior_high.year_graduated.required' => 'Junior High School year graduated is required.',
            'education.junior_high.general_average.required' => 'Junior High School general average is required.',


            'education.senior_high.education_level.required' => 'Senior High School education level is required.',
            'education.senior_high.education_level.in' => 'Senior High School education level must be Senior Highschool.',

            'education.senior_high.school_name.required' => 'Senior High School name is required.',
            'education.senior_high.school_address.required' => 'Senior High School address is required.',
            'education.senior_high.strand.required' => 'Senior High School strand is required.',
            'education.senior_high.school_type.required' => 'Senior High School type is required.',
            'education.senior_high.year_graduated.required' => 'Senior High School year graduated is required.',
            'education.senior_high.general_average.required' => 'Senior High School general average is required.',


            'education.college.education_level.required' => 'College education level is required for transferees or if college information is provided.',
            'education.college.education_level.in' => 'College education level must be College.',

            'education.college.school_name.required' => 'College school name is required.',
            'education.college.school_name.max' => 'College school name may not exceed 150 characters.',

            'education.college.school_address.required' => 'College school address is required.',
            'education.college.school_address.max' => 'College school address may not exceed 250 characters.',

            'education.college.school_type.required' => 'College school type is required.',
            'education.college.school_type.in' => 'College school type must be Public or Private.',

            'education.college.year_graduated.required' => 'College year graduated is required.',

            'education.college.general_average.required' => 'College general average is required.',
            'education.college.general_average.numeric' => 'College general average must be a number.',
            'education.college.general_average.min' => 'College general average must be at least 75.',
            'education.college.general_average.max' => 'College general average may not exceed 100.',

            'education.college.scholarship_mobile_num.numeric' => 'Scholarship mobile number must be numeric.',
            'education.college.scholarship_mobile_num.starts_with' => 'Scholarship mobile number must start with 9.',
            'education.college.scholarship_mobile_num.digits' => 'Scholarship mobile number must be exactly 10 digits.',
        ];
    }
}

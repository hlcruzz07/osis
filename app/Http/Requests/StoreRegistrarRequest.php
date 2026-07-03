<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRegistrarRequest extends FormRequest
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

        return [
            // STUDENT INFORMATION
            'student.lrn' => 'nullable|digits:12|numeric',
            'student.fname' => 'required|string|max:50',
            'student.mname' => 'nullable|string|max:50',
            'student.lname' => 'required|string|max:50',
            'student.suffix' => 'nullable|string|max:10',
            'student.birthdate' => 'required|date|before_or_equal:today',
            'student.birthplace' => 'required|string|max:100',
            'student.civil_status' => 'required|string|max:50',
            'student.gender' => 'required|string|max:25',
            'student.email' => 'required|email|max:50',
            'student.religion' => 'required|string',
            'student.mobile_num' => 'nullable|numeric|starts_with:9|digits:10',
            'student.date_admitted' => 'required|date',
            'student.campus' => 'required|string|max:100',
            'student.course' => 'required|string|max:100',
            'student.major' => [
                'required_if:student.has_major,true'
            ],
            'student.is_first_generation_student' => 'boolean',
            'student.is_indigenous_people' => 'boolean',
            'student.ethnic_group' => 'required_if:student.is_indigenous_people,true|nullable|string|max:100',
            'student.scholarship_program' => 'nullable|string|max:150',
            'student.scholarship_contact' => ['nullable', 'numeric', 'starts_with:9', 'digits:10'],
            'student.scholarship_address' => 'nullable|string|max:150',

            // ADDRESS INFORMATION
            'address.island' => 'required|string',
            'address.region' => 'required|string',
            'address.province' => 'required|string',
            'address.city' => 'required|string',
            'address.brgy' => 'required|string',
            'address.zip_code' => 'required|numeric|digits:4',
            'address.street' => 'required|string|max:150',

            // GUARDIANS
            'guardians' => 'required|array|min:2',
            'guardians.*.role' => 'required|string',
            'guardians.*.fname' => 'required|string|max:50',
            'guardians.*.mname' => 'nullable|string|max:50',
            'guardians.*.lname' => 'required|string|max:50',
            'guardians.*.suffix' => 'nullable|string|max:10',
            'guardians.*.mobile_num' => [
                'nullable',
                'required_if:guardians.*.is_contact_person,true',
                'numeric',
                'starts_with:9',
                'digits:10',
            ],
            'guardians.*.highest_educ_attainment' => 'required|string|max:50',
            'guardians.*.is_contact_person' => 'boolean',

            // GUARDIAN ADDRESS
            'guardians.*.address.island' => 'required|string',
            'guardians.*.address.region' => 'required|string',
            'guardians.*.address.province' => 'required|string',
            'guardians.*.address.city' => 'required|string',
            'guardians.*.address.brgy' => 'required|string',
            'guardians.*.address.zip_code' => 'required|numeric|digits:4',
            'guardians.*.address.street' => 'required|string|max:150',

            // EDUCATION
            'educations' => 'required|array|min:3',
            'educations.*.education_level' => 'required|in:Elementary,Junior High School,Senior High School,College,Grad School',
            'educations.*.school_name' => 'required|string|max:150',
            'educations.*.school_address' => 'required|string|max:250',
            'educations.*.school_type' => 'required|string|max:50',
            'educations.*.year_graduated' => 'nullable|numeric|digits:4',
            'educations.*.strand' => 'nullable|string|max:50',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $guardians = $this->input('guardians', []);
            $hasContactPerson = collect($guardians)->contains(fn($g) => !empty($g['is_contact_person']));

            if (!$hasContactPerson) {
                $validator->errors()->add('guardians', 'Please designate at least one guardian as a contact person.');
            }
        });
    }

    public function messages(): array
    {
        return [
            // STUDENT INFO
            'student.lrn.digits' => 'LRN must be exactly 12 digits.',
            'student.fname.required' => 'First name is required.',
            'student.fname.max' => 'First name may not exceed 50 characters.',
            'student.lname.required' => 'Last name is required.',
            'student.lname.max' => 'Last name may not exceed 50 characters.',
            'student.mname.max' => 'Middle name may not exceed 50 characters.',
            'student.birthdate.required' => 'Birthdate is required.',
            'student.birthdate.date' => 'Birthdate must be a valid date.',
            'student.birthdate.before_or_equal' => 'Birthdate must be today or earlier.',
            'student.birthplace.required' => 'Birthplace is required.',
            'student.birthplace.max' => 'Birthplace may not exceed 100 characters.',
            'student.civil_status.required' => 'Civil status is required.',
            'student.civil_status.in' => 'Selected civil status is invalid.',
            'student.gender.required' => 'Sexual orientation is required.',
            'student.gender.max' => 'Sexual orientation may not exceed 25 characters.',
            'student.email.required' => 'Email is required.',
            'student.email.email' => 'Email must be a valid email address.',
            'student.religion.required' => 'Religion is required.',
            'student.email.max' => 'Email may not exceed 50 characters.',
            'student.mobile_num.numeric' => 'Mobile number must be numeric.',
            'student.mobile_num.starts_with' => 'Mobile number must start with 9.',
            'student.mobile_num.digits' => 'Mobile number must be exactly 10 digits.',
            'student.date_admitted.required' => 'Date admitted is required.',
            'student.date_admitted.date' => 'Date admitted must be a valid date.',
            'student.date_admitted.before_or_equal' => 'Date admitted must be today or earlier.',
            'student.student_type.required' => 'Student type is required.',
            'student.student_type.in' => 'Selected student type is invalid.',
            'student.campus.required' => 'Campus is required.',
            'student.course.required' => 'Course is required.',
            'student.course.in' => 'Selected course is invalid.',
            'student.major' => 'Major field is required for the selected course.',
            'student.ethnic_group.required_if' => 'Ethnic group is required when you are a member of Indigenous People.',
            'student.ethnic_group.max' => 'Ethnic group may not exceed 100 characters.',

            // ADDRESS
            'address.island.required' => 'Island group is required.',
            'address.region.required' => 'Region is required.',
            'address.province.required' => 'Province is required.',
            'address.city.required' => 'City/Municipality is required.',
            'address.brgy.required' => 'Barangay is required.',
            'address.street.required' => 'Street is required.',
            'address.street.max' => 'Street may not exceed 150 characters.',
            'address.zip_code.required' => 'Zip code is required.',
            'address.zip_code.numeric' => 'Zip code must be numeric.',
            'address.zip_code.digits' => 'Zip code must be exactly 4 digits.',

            // GUARDIANS
            'guardians.required' => 'At least guardians information is required.',
            'guardians.min' => 'At least 2 guardians are required.',
            'guardians.*.fname.required' => 'Guardian first name is required.',
            'guardians.*.fname.max' => 'Guardian first name may not exceed 50 characters.',
            'guardians.*.lname.required' => 'Guardian last name is required.',
            'guardians.*.lname.max' => 'Guardian last name may not exceed 50 characters.',
            'guardians.*.birthdate.required' => 'Guardian birthdate is required.',
            'guardians.*.birthdate.date' => 'Guardian birthdate must be a valid date.',
            'guardians.*.religion.required' => 'Guardian religion is required.',
            'guardians.*.religion.in' => 'Selected religion is invalid.',
            'guardians.*.citizenship.required' => 'Guardian citizenship is required.',
            'guardians.*.highest_educ_attainment.required' => 'Guardian educational attainment is required.',
            'guardians.*.highest_educ_attainment.in' => 'Selected educational attainment is invalid.',
            'guardians.*.life_status.required' => 'Guardian life status is required.',
            'guardians.*.life_status.in' => 'Selected life status is invalid.',
            'guardians.*.mobile_num.required_if' => 'Guardian mobile number is required when they are the contact person.',
            'guardians.*.mobile_num.numeric' => 'Guardian mobile number must be numeric.',
            'guardians.*.mobile_num.starts_with' => 'Guardian mobile number must start with 9.',
            'guardians.*.mobile_num.digits' => 'Guardian mobile number must be exactly 10 digits.',
            'guardians.*.cause_of_death.required_if' => 'Cause of death is required when life status is Deceased.',
            'guardians.*.cause_of_death.max' => 'Cause of death may not exceed 100 characters.',
            'guardians.*.year_of_death.required_if' => 'Year of death is required when life status is Deceased.',
            'guardians.*.year_of_death.numeric' => 'Year of death must be numeric.',
            'guardians.*.year_of_death.digits' => 'Year of death must be exactly 4 digits.',
            'guardians.*.address.island.required' => 'Guardian island group is required.',
            'guardians.*.address.region.required' => 'Guardian region is required.',
            'guardians.*.address.province.required' => 'Guardian province is required.',
            'guardians.*.address.city.required' => 'Guardian city/municipality is required.',
            'guardians.*.address.brgy.required' => 'Guardian barangay is required.',
            'guardians.*.address.zip_code.required' => 'Guardian zip code is required.',
            'guardians.*.address.zip_code.numeric' => 'Guardian zip code must be numeric.',
            'guardians.*.address.zip_code.digits' => 'Guardian zip code must be exactly 4 digits.',
            'guardians.*.address.street.required' => 'Guardian street is required.',
            'guardians.*.address.street.max' => 'Guardian street may not exceed 150 characters.',

            // EDUCATION
            'educations.required' => 'Education information is required.',
            'educations.min' => 'At least 3 education levels are required.',
            'educations.*.education_level.required' => 'Education level is required.',
            'educations.*.education_level.in' => 'Selected education level is invalid.',
            'educations.*.school_name.required' => 'School name is required.',
            'educations.*.school_name.max' => 'School name may not exceed 150 characters.',
            'educations.*.school_address.required' => 'School address is required.',
            'educations.*.school_address.max' => 'School address may not exceed 250 characters.',
            'educations.*.school_type.required' => 'School type is required.',
            'educations.*.school_type.in' => 'Selected school type is invalid.',
            'educations.*.year_graduated.required' => 'Year graduated is required.',
            'educations.*.year_graduated.numeric' => 'Year graduated must be numeric.',
            'educations.*.year_graduated.digits' => 'Year graduated must be exactly 4 digits.',
            'educations.*.general_average.required' => 'General average is required.',
            'educations.*.general_average.numeric' => 'General average must be numeric.',
            'educations.*.general_average.min' => 'General average must be at least 75.',
            'educations.*.general_average.max' => 'General average may not exceed 100.',
            'educations.*.strand.max' => 'Strand may not exceed 50 characters.',
            'educations.*.course.max' => 'Course may not exceed 50 characters.',
            'educations.*.scholarship_program.max' => 'Scholarship program may not exceed 50 characters.',
            'educations.*.scholarship_address.max' => 'Scholarship address may not exceed 150 characters.',
            'educations.*.scholarship_mobile_num.numeric' => 'Scholarship mobile number must be numeric.',
            'educations.*.scholarship_mobile_num.starts_with' => 'Scholarship mobile number must start with 9.',
            'educations.*.scholarship_mobile_num.digits' => 'Scholarship mobile number must be exactly 10 digits.',
        ];
    }
}

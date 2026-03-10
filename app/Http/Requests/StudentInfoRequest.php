<?php

namespace App\Http\Requests;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentInfoRequest extends FormRequest
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
            'student.lrn' => 'nullable|string|max:12',
            'student.year_level' => 'required',
            'student.campus' => 'required|in:Talisay,Alijis,Fortune Towne,Binalbagan',
            'student.course' => [
                'required',
                Rule::in([
                    'Ba In English Language',
                    'Ba Social Science',
                    'Bs Psychology',
                    'B Of Public Administration',
                    'Bs In Applied Mathematics',
                    'B Of Elementary Education',
                    'B Of Early Childhood Educ',
                    'B Of Physical Education',
                    'B Of Secondary Education',
                    'B Of Special Needs Education',
                    'B Of Technology & Livelihood Education',
                    'B Of Industrial Technology',
                    'Bs In Industrial Technology',
                    'Bs In Hospitality Management',
                    'Bs In Information Systems',
                    'Bs In Civil Engineering',
                ]),
            ],
            'student.date_admitted' => 'required|date',
            'student.student_type' => [
                'required',
                Rule::in([
                    'Shiftee',
                    'Returnee',
                    'Continuing',
                    'Transferee',
                    'Fresh Graduate'
                ])
            ],

            'student.equity_indicator' => [
                'required',
                Rule::in([
                    'First Generation College Student',
                    'Four Ps Beneficiary',
                    'Solo Parent',
                    'Raised By A Single Or Solo Parent',
                    'Orphan',
                    'Person With Disability',
                    'Living In A Geographically Isolated And Disadvantaged Area',
                    'Member Of Indigenous People',
                    'Belongs To A Family Of Subsistence Farmers Or Fisher Folks',
                    'Belongs To A Family Of Rebel Returnees',
                    'Not Applicable',
                ])
            ],
            'student.fname' => 'required|max:50',
            'student.mname' => 'nullable|max:50',
            'student.lname' => 'required|max:50',
            'student.suffix' => ['nullable', Rule::in(['Jr', 'Sr', 'I', 'II', 'III', 'IV', 'V'])],
            'student.birthdate' => 'required|date',
            'student.birthplace' => 'required|max:100',
            'student.weekly_allowance' => 'required|numeric|min:0',
            'student.financer' => 'required|max:50',
            'student.last_attended_school' => 'required|max:100',

            'student.religion' => [
                'required',
                Rule::in([
                    'Roman Catholic',
                    'Baptist',
                    'Methodist',
                    'Pentecostal',
                    'Evangelical',
                    'Seventh-day Adventist',
                    'Lutheran',
                    'Presbyterian',
                    'United Church Of Christ In the Philippines (UCCP)',
                    'Iglesia Ni Cristo',
                    'Sunni Islam',
                    'Shia Islam',
                    'Aglipayan Church (Philippine Independent Church)',
                    "Jehovah's Witnesses",
                    'Church Of Jesus Christ Of Latter-day Saints (Mormons)',
                    'Judaism',
                    'Mahayana Buddhism',
                    'Theravada Buddhism',
                    'Vaishnavism (Hinduism)',
                    'Shaivism (Hinduism)',
                    'Lumad Spirituality',
                    'Cordillera Indigenous Religions',
                    'Anito / Ancestor Worship',
                    'Shamanistic Practices',
                    'Agnostic',
                    'Atheist',
                    'Humanist',
                    'Secular',
                ])
            ],
            'student.citizenship' => 'required',
            'student.civil_status' => [
                'required',
                Rule::in([
                    'None',
                    'Single',
                    'Married',
                    'Widow',
                    'Divorced',
                ])
            ],
            // 'student.sexual_orient' => 'required|max:25',
            // 'student.height' => 'required|numeric|min:30|digits_between:1,3',
            // 'student.weight' => 'required|numeric|min:30|digits_between:1,3',

            // 'student.address.island' => 'required|max:50',
            // 'student.address.province' => 'required|max:50',
            // 'student.address.city' => 'required|max:50',
            // 'student.address.barangay' => 'required|max:50',
        ];


    }

    public function messages(): array
    {
        return [

            // LRN

            'student.lrn.max' => 'LRN must not exceed 12 characters.',

            // Year & Campus
            'student.year_level.required' => 'Year level is required.',
            'student.campus.required' => 'Campus is required.',
            'student.campus.in' => 'Selected campus is invalid.',

            // Course
            'student.course.required' => 'Course is required.',
            'student.course.in' => 'Selected course is invalid.',

            // Admission
            'student.date_admitted.required' => 'Date admitted is required.',
            'student.date_admitted.date' => 'Date admitted must be a valid date.',

            'student.student_type.required' => 'Student type is required.',
            'student.student_type.in' => 'Selected student type is invalid.',

            'student.equity_indicator.required' => 'Equity indicator is required.',
            'student.equity_indicator.in' => 'Selected equity indicator is invalid.',

            // Name
            'student.fname.required' => 'First name is required.',
            'student.fname.max' => 'First name must not exceed 50 characters.',

            'student.mname.max' => 'Middle name must not exceed 50 characters.',

            'student.lname.required' => 'Last name is required.',
            'student.lname.max' => 'Last name must not exceed 50 characters.',

            'student.suffix.in' => 'Suffix must be Jr, Sr, I, II, III, IV, or V.',

            // Birth Info
            'student.birthdate.required' => 'Birth date is required.',
            'student.birthdate.date' => 'Birth date must be a valid date.',

            'student.birthplace.required' => 'Birth place is required.',
            'student.birthplace.max' => 'Birth place must not exceed 100 characters.',

            // Financial
            'student.weekly_allowance.required' => 'Weekly allowance is required.',
            'student.weekly_allowance.numeric' => 'Weekly allowance must be a number.',
            'student.weekly_allowance.min' => 'Weekly allowance cannot be negative.',

            'student.financer.required' => 'Financer name is required.',
            'student.financer.max' => 'Financer name must not exceed 50 characters.',

            'student.last_attended_school.required' => 'Last attended school is required.',
            'student.last_attended_school.max' => 'Last attended school must not exceed 100 characters.',

            // Religion & Status
            'student.religion.required' => 'Religion is required.',
            'student.religion.in' => 'Selected religion is invalid.',

            'student.citizenship.required' => 'Citizenship is required.',

            'student.civil_status.required' => 'Civil status is required.',
            'student.civil_status.in' => 'Selected civil status is invalid.',

            // Personal
            'student.sexual_orient.required' => 'Sexual orientation is required.',
            'student.sexual_orient.max' => 'Sexual orientation must not exceed 25 characters.',

            'student.height.required' => 'Height is required.',
            'student.height.numeric' => 'Height must be a number.',
            'student.height.min' => 'Height must be at least 30 cm.',
            'student.height.digits_between' => 'Height must be between 2 and 3 digits.',


            'student.weight.required' => 'Weight is required.',
            'student.weight.numeric' => 'Weight must be a number.',
            'student.weight.min' => 'Weight must be at least 30 kg.',
            'student.weight.digits_between' => 'Weight must be between 2 and 3 digits.',
            // Address
            // 'student.address.island.required' => 'Island is required.',
            // 'student.address.province.required' => 'Province is required.',
            // 'student.address.city.required' => 'City is required.',
            // 'student.address.barangay.required' => 'Barangay is required.',

        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator)
    {
        $validator->after(function ($validator) {

            $fname = $this->input('student.fname');
            $mname = $this->input('student.mname');
            $lname = $this->input('student.lname');

            $query = Student::where('fname', $fname)
                ->where('lname', $lname);

            if (!empty($mname)) {
                $query->where('mname', $mname);
            } else {

                $query->where(function ($q) {
                    $q->whereNull('mname')
                        ->orWhere('mname', '');
                });
            }

            if ($query->exists()) {
                $validator->errors()->add(
                    'student.fname',
                    'A student with the same first, middle, and last name has already submitted the form.'
                );
            }
        });
    }
}

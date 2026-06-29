<?php

namespace App\Http\Requests;

use App\Models\Student;
use App\Repositories\EntityDropdownRepo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStudentInfoRequest extends FormRequest
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
        $entityRepo = new EntityDropdownRepo();

        $flatten = fn(array $items) => array_values(
            array_filter(
                array_map(fn($item) => is_array($item) ? ($item['name'] ?? null) : $item, $items),
                fn($v) => $v !== null,
            )
        );

        $validYearLevels      = $flatten($entityRepo->getDropdownsByTitle('Year Levels'));
        $validCourses         = $flatten($entityRepo->getDropdownsByTitle('Courses'));
        $validCampuses        = $flatten($entityRepo->getDropdownsByTitle('Campuses'));
        $validStudentType     = $flatten($entityRepo->getDropdownsByTitle('Student Type'));
        $validSuffixes        = $flatten($entityRepo->getDropdownsByTitle('Suffix'));
        $validEquityIndicator = $flatten($entityRepo->getDropdownsByTitle('Equity Indicator'));
        $validReligions       = $flatten($entityRepo->getDropdownsByTitle('Religion'));
        $validCivilStatus     = $flatten($entityRepo->getDropdownsByTitle('Civil Status'));

        return [
            'lrn' => 'nullable|digits:12',
            'year_level' => ['required', Rule::in($validYearLevels)],
            'campus' => ['required', Rule::in($validCampuses)],
            'course' => ['required', Rule::in($validCourses)],
            'major' => 'nullable|string|max:100',
            'date_admitted' => 'required|date|before_or_equal:today',
            'student_type' => ['required', Rule::in($validStudentType)],

            'equity_indicator' => ['nullable', Rule::in($validEquityIndicator)],
            'fname' => 'required|max:50',
            'mname' => 'nullable|max:50',
            'lname' => 'required|max:50',
            'suffix' => ['nullable', Rule::in($validSuffixes)],
            'birthdate' => 'required|date|before_or_equal:today',
            'birthplace' => 'required|max:100',
            'weekly_allowance' => 'nullable|numeric|min:0',
            'financer' => 'nullable|max:50',
            'last_attended_school' => 'nullable|max:100',
            'religion' => ['nullable', Rule::in($validReligions)],
            'citizenship' => 'nullable',
            'civil_status' => ['required', Rule::in($validCivilStatus)],
            'sexual_orient' => 'required|max:25',
            'height' => 'nullable|numeric|min:30|digits_between:2,3',
            'weight' => 'nullable|numeric|min:30|digits_between:2,3',
            'email' => 'nullable|email|max:50',
            'mobile_num' => 'nullable|numeric|starts_with:9|digits:10',
        ];
    }

    public function messages(): array
    {
        return [

            // LRN

            'lrn.digits' => 'LRN should be exactly 12 digits.',

            // Year & Campus
            'year_level.required' => 'Year level is required.',
            'year_level.in' => 'Selected year level is invalid.',
            'campus.required' => 'Campus is required.',
            'campus.in' => 'Selected campus is invalid.',

            // Course
            'course.required' => 'Course is required.',
            'course.in' => 'Selected course is invalid.',

            // Admission
            'date_admitted.required' => 'Date admitted is required.',
            'date_admitted.date' => 'Date admitted must be a valid date.',
            'date_admitted.before_or_equal' => 'The date admitted cannot be in the future.',

            'student_type.required' => 'Student type is required.',
            'student_type.in' => 'Selected student type is invalid.',

            'equity_indicator.required' => 'Equity indicator is required.',
            'equity_indicator.in' => 'Selected equity indicator is invalid.',

            // Name
            'fname.required' => 'First name is required.',
            'fname.max' => 'First name must not exceed 50 characters.',

            'mname.max' => 'Middle name must not exceed 50 characters.',

            'lname.required' => 'Last name is required.',
            'lname.max' => 'Last name must not exceed 50 characters.',

            'suffix.in' => 'Suffix must be Jr, Sr, I, II, III, IV, or V.',

            // Birth Info
            'birthdate.required' => 'Birth date is required.',
            'birthdate.date' => 'Birth date must be a valid date.',
            'birthdate.before_or_equal' => 'The date of birth cannot be in the future.',

            'birthplace.required' => 'Birth place is required.',
            'birthplace.max' => 'Birth place must not exceed 100 characters.',

            // Financial
            'weekly_allowance.required' => 'Weekly allowance is required.',
            'weekly_allowance.numeric' => 'Weekly allowance must be a number.',
            'weekly_allowance.min' => 'Weekly allowance cannot be negative.',

            'financer.required' => 'Financer name is required.',
            'financer.max' => 'Financer name must not exceed 50 characters.',

            'last_attended_school.required' => 'Last attended school is required.',
            'last_attended_school.max' => 'Last attended school must not exceed 100 characters.',

            // Religion & Status
            'religion.required' => 'Religion is required.',
            'religion.in' => 'Selected religion is invalid.',

            'citizenship.required' => 'Citizenship is required.',

            'civil_status.required' => 'Civil status is required.',
            'civil_status.in' => 'Selected civil status is invalid.',

            // Personal
            'sexual_orientrequired' => 'Sexual orientation is required.',
            'sexual_orientmax' => 'Sexual orientation must not exceed 25 characters.',

            'height.required' => 'Height is required.',
            'height.numeric' => 'Height must be a number.',
            'height.min' => 'Height must be at least 30 cm.',
            'height.digits_between' => 'Height must be between 2 and 3 digits.',


            'weight.required' => 'Weight is required.',
            'weight.numeric' => 'Weight must be a number.',
            'weight.min' => 'Weight must be at least 30 kg.',
            'weight.digits_between' => 'Weight must be between 2 and 3 digits.',

            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Email must not exceed 50 characters.',

            // Mobile number
            'mobile_num.numeric' => 'Mobile number must contain numbers only.',
            'mobile_num.starts_with' => 'Mobile number should always starts with 9.',
            'mobile_num.digits' => 'Mobile number must be exactly 10 digits.',

        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator)
    {
        $validator->after(function ($validator) {

            $studentId = $this->route('id');

            $fname = $this->input('fname');
            $mname = $this->input('mname');
            $lname = $this->input('lname');

            $fnameHash = hash('sha256', trim($fname));
            $lnameHash = hash('sha256', trim($lname));
            $mnameHash = !empty($mname)
                ? hash('sha256', trim($mname))
                : null;

            $query = Student::where('fname_hash', $fnameHash)
                ->where('lname_hash', $lnameHash)
                ->where('id', '!=', $studentId);

            if ($mnameHash) {
                $query->where('mname_hash', $mnameHash);
            } else {
                $query->where(function ($q) {
                    $q->whereNull('mname_hash')
                        ->orWhere('mname_hash', '');
                });
            }

            if ($query->exists()) {
                $validator->errors()->add(
                    'fname',
                    'A student with the same first, middle, and last name already exists.'
                );
            }

            $email = $this->input('email');
            $mobile_num = $this->input('mobile_num');

            if (!empty($email)) {
                $emailHash = hash('sha256', trim($email));
                $exists = Student::where('email_hash', $emailHash)
                    ->where('id', '!=', $studentId) // exclude current
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'email',
                        'This email is already taken.'
                    );
                }
            }

            if (!empty($mobile_num)) {
                $mobileNumHash = hash('sha256', trim($mobile_num));
                $exists = Student::where('mobile_num_hash', $mobileNumHash)
                    ->where('id', '!=', $studentId) // exclude current
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'mobile_num',
                        'This mobile number is already taken.'
                    );
                }
            }
        });
    }
}

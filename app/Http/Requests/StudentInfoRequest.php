<?php

namespace App\Http\Requests;

use App\Models\EntityDropdown;
use App\Models\Student;
use App\Repositories\EntityDropdownRepo;
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

    public function __construct()
    {
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $entityRepo = new EntityDropdownRepo();

        $validYearLevels = $entityRepo->getDropdownsByTitle('Year Levels');
        $validCourses = $entityRepo->getDropdownsByTitle('Courses');
        $validCampuses = $entityRepo->getDropdownsByTitle('Campuses');
        $validStudentType = $entityRepo->getDropdownsByTitle('Student Type');
        $validSuffixes = $entityRepo->getDropdownsByTitle('Suffix');
        $validEquityIndicator = $entityRepo->getDropdownsByTitle('Equity Indicator');
        $validReligions = $entityRepo->getDropdownsByTitle('Religion');
        $validCivilStatus = $entityRepo->getDropdownsByTitle('Civil Status');

        return [
            'student.academic_year' => 'required',
            'student.semester' => 'required',
            'student.lrn' => 'nullable|string|max:12',
            'student.year_level' => ['required', Rule::in($validYearLevels)],
            'student.campus' => ['required', Rule::in($validCampuses)],
            'student.course' => [
                'required',
                Rule::in($validCourses),
            ],
            'student.date_admitted' => 'required|date',
            'student.student_type' => [
                'required',
                Rule::in($validStudentType)
            ],

            'student.equity_indicator' => [
                'required',
                Rule::in($validEquityIndicator)
            ],
            'student.fname' => 'required|max:50',
            'student.mname' => 'nullable|max:50',
            'student.lname' => 'required|max:50',
            'student.suffix' => ['nullable', Rule::in($validSuffixes)],
            'student.birthdate' => 'required|date',
            'student.birthplace' => 'required|max:100',
            'student.weekly_allowance' => 'required|numeric|min:0',
            'student.financer' => 'required|max:50',
            'student.last_attended_school' => 'required|max:100',
            'student.religion' => [
                'required',
                Rule::in($validReligions)
            ],
            'student.citizenship' => 'required',
            'student.civil_status' => [
                'required',
                Rule::in($validCivilStatus)
            ],
            'student.sexual_orient' => 'required|max:25',
            'student.height' => 'required|numeric|min:30|digits_between:2,3',
            'student.weight' => 'required|numeric|min:30|digits_between:2,3',
        ];


    }

    public function messages(): array
    {
        return [

            // LRN

            'student.lrn.max' => 'LRN must not exceed 12 characters.',

            // Year & Campus
            'student.year_level.required' => 'Year level is required.',
            'student.year_level.in' => 'Selected year level is invalid.',
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
            'student.sexual_orientrequired' => 'Sexual orientation is required.',
            'student.sexual_orientmax' => 'Sexual orientation must not exceed 25 characters.',

            'student.height.required' => 'Height is required.',
            'student.height.numeric' => 'Height must be a number.',
            'student.height.min' => 'Height must be at least 30 cm.',
            'student.height.digits_between' => 'Height must be between 2 and 3 digits.',


            'student.weight.required' => 'Weight is required.',
            'student.weight.numeric' => 'Weight must be a number.',
            'student.weight.min' => 'Weight must be at least 30 kg.',
            'student.weight.digits_between' => 'Weight must be between 2 and 3 digits.',

        ];
    }

    public function withValidator(\Illuminate\Validation\Validator $validator)
    {
        $validator->after(function ($validator) {

            $fname = $this->input('student.fname');
            $mname = $this->input('student.mname');
            $lname = $this->input('student.lname');

            $fnameHash = hash('sha256', trim($fname));
            $lnameHash = hash('sha256', trim($lname));
            $mnameHash = !empty($mname)
                ? hash('sha256', trim($mname))
                : null;

            $query = Student::where('fname_hash', $fnameHash)
                ->where('lname_hash', $lnameHash);

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
                    'student.fname',
                    'A student with the same first, middle, and last name has already submitted the form.'
                );
            }
        });
    }
}

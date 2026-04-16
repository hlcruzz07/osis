<?php

namespace App\Http\Requests;

use App\Repositories\EntityDropdownRepo;
use App\Repositories\GuardianRepo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateGuardianRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */

    public function __construct(protected GuardianRepo $guardianRepo)
    {
    }
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

        $validSuffixes = $entityRepo->getDropdownsByTitle("Suffix");
        $validReligion = $entityRepo->getDropdownsByTitle("Religion");
        $validEducationalAttainment = $entityRepo->getDropdownsByTitle("Educational Attainment");
        $validLifeStatus = $entityRepo->getDropdownsByTitle("Life Status");
        $validFamilyRoles = $entityRepo->getDropdownsByTitle("Family Role");

        return [
            'fname' => 'required|string|max:50',
            'mname' => 'nullable|string|max:50',
            'lname' => 'required|string|max:50',
            'suffix' => ['nullable', Rule::in($validSuffixes)],
            'role' => [
                'required',
                Rule::in($validFamilyRoles),
                function ($attribute, $value, $fail) {
                    $student_id = $this->route('student_id');

                    $existingRole = $this->guardianRepo->hasExistingGuardian($student_id, $value);

                    if ($existingRole) {
                        $fail('You already have a guardian with this role.');
                    }
                }
            ],
            'birthdate' => 'required|date',
            'birthplace' => 'nullable|string|max:150',
            'mobile_num' => [
                'nullable',
                'required_if:is_contact_person,true',
                'numeric',
                'starts_with:9',
                'digits:10',
            ],

            'religion' => [
                'required',
                Rule::in($validReligion)
            ],
            'citizenship' => 'required|string|max:50',
            'highest_educ_attainment' => [
                'required',
                Rule::in($validEducationalAttainment),
                'string'
            ],
            'life_status' => ['required', 'string', Rule::in($validLifeStatus)],
            'is_contact_person' => [
                'boolean',
            ],
            'occupation' => 'nullable|string|max:100',
            'cause_of_death' => 'nullable|string|max:100',
            'year_of_death' => 'nullable|digits:4',
        ];
    }

    public function messages(): array
    {
        return [
            'fname.required' => 'First name is required.',
            'lname.required' => 'Last name is required.',
            'birthdate.required' => 'Birthdate is required.',

            'mobile_num.required_if' => 'Mobile number is required when set as contact person.',
            'mobile_num.starts_with' => 'Mobile number must start with 9.',
            'mobile_num.digits' => 'Mobile number must be exactly 10 digits.',

            'religion.required' => 'Please select a religion.',
            'citizenship.required' => 'Citizenship is required.',
            'highest_educ_attainment.required' => 'Educational attainment is required.',
            'life_status.required' => 'Life status is required.',

        ];
    }
}

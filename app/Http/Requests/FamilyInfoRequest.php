<?php

namespace App\Http\Requests;

use App\Repositories\EntityDropdownRepo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FamilyInfoRequest extends FormRequest
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

        $validHouseMonthlyIncome = $entityRepo->getDropdownsByTitle("Household Monthly Income");
        $validSuffixes = $entityRepo->getDropdownsByTitle("Suffix");
        $validReligion = $entityRepo->getDropdownsByTitle("Religion");
        $validEducationalAttainment = $entityRepo->getDropdownsByTitle("Educational Attainment");
        $validLifeStatus = $entityRepo->getDropdownsByTitle("Life Status");

        $has_siblings = count($this->input('family.siblings', [])) > 0;


        return [

            'student.family_size' => 'required|integer|min:1|max:25',
            'student.parent_marital_status' => 'required|max:50',
            'student.nature_residence' => 'required|max:50',

            'student.house_monthly_income' => [
                'required',
                Rule::in($validHouseMonthlyIncome)
            ],

            'student.ordinal_position' => 'required|max:50',

            'family.siblings' => [
                Rule::requiredIf($has_siblings),
                'array',
            ],

            'family.siblings.*.fname' => [
                Rule::requiredIf($has_siblings),

                'max:150'
            ],

            'family.siblings.*.lname' => [
                Rule::requiredIf($has_siblings),

                'max:150'
            ],

            'family.siblings.*.gender' => [
                Rule::requiredIf($has_siblings),
                'string',
                'in:Male,Female'
            ],

            'family.siblings.*.mname' => 'nullable|max:50',
            'family.siblings.*.suffix' => ['nullable', Rule::in($validSuffixes)],

            // Guardians Inputs
            'family.guardians.*.fname' => 'required|string|max:50',
            'family.guardians.*.mname' => 'nullable|string|max:50',
            'family.guardians.*.lname' => 'required|string|max:50',
            'family.guardians.*.suffix' => ['nullable', Rule::in($validSuffixes)],

            'family.guardians.*.birthdate' => 'required|date',
            'family.guardians.*.birthplace' => 'nullable|string|max:150',
            'family.guardians.*.mobile_num' => [
                'nullable',
                'required_if:family.guardians.*.is_contact_person,true',
                'numeric',
                'starts_with:9',
                'digits:10',
            ],

            'family.guardians.*.religion' => [
                'required',
                Rule::in($validReligion)
            ],
            'family.guardians.*.citizenship' => 'required|string|max:50',
            'family.guardians.*.highest_educ_attainment' => [
                'required',
                Rule::in($validEducationalAttainment),
                'string'
            ],
            'family.guardians.*.life_status' => ['required', 'string', Rule::in($validLifeStatus)],
            'family.guardians.*.is_contact_person' => 'boolean',
            'family.guardians' => [
                function ($attribute, $value, $fail) {
                    $count = collect($value)->where('is_contact_person', true)->count();
                    if ($count !== 1) {
                        $fail('Please choose atleast one person to be your contact person');
                    }
                }
            ],
            'family.guardians.*.occupation' => 'nullable|string|max:100',


            // Address
            'family.guardians.*.address.island' => ['required', Rule::in(['Luzon', 'Visayas', 'Mindanao'])],
            'family.guardians.*.address.region' => 'required',
            'family.guardians.*.address.province' => 'required',
            'family.guardians.*.address.city' => 'required',
            'family.guardians.*.address.brgy' => 'required',
            'family.guardians.*.address.zip_code' => 'required|numeric|digits:4',

        ];
    }

    public function messages(): array
    {
        return [

            // Family Info
            'student.family_size.required' => 'Family size is required.',
            'student.family_size.integer' => 'Family size must be a valid number.',
            'student.family_size.min' => 'Family size must be at least 1.',
            'student.family_size.max' => 'Family maximum size is 25.',

            'student.parent_marital_status.required' => 'Parent marital status is required.',
            'student.nature_residence.required' => 'Nature of residence is required.',

            'student.house_monthly_income.required' => 'Please select your house monthly income.',
            'student.house_monthly_income.in' => 'Selected monthly income is invalid.',

            'student.ordinal_position.required' => 'Ordinal position is required.',
            'family.siblings.required' => 'Please provide sibling information.',
            'family.siblings.array' => 'Siblings must be a valid list.',

            'family.siblings.*.fname.required' => 'Sibling first name is required.',
            'family.siblings.*.lname.required' => 'Sibling last name is required.',
            'family.siblings.*.gender.required' => 'Sibling gender is required.',
            'family.siblings.*.gender.in' => 'Sibling gender must be Male or Female.',

            // Guardians
            'family.guardians.*.fname.required' => 'Guardian first name is required.',
            'family.guardians.*.lname.required' => 'Guardian last name is required.',
            'family.guardians.*.birthdate.required' => 'Guardian birthdate is required.',
            'family.guardians.*.birthdate.date' => 'Guardian birthdate must be a valid date.',

            'family.guardians.*.mobile_num.required_if' =>
                'Mobile number is required for the selected contact person.',
            'family.guardians.*.mobile_num.numeric' =>
                'Mobile number must contain only numbers.',
            'family.guardians.*.mobile_num.starts_with' =>
                'Mobile number must start with 9.',
            'family.guardians.*.mobile_num.digits' =>
                'Mobile number must be exactly 10 digits.',

            'family.guardians.*.religion.required' => 'Religion is required.',
            'family.guardians.*.religion.in' => 'Selected religion is invalid.',

            'family.guardians.*.citizenship.required' => 'Citizenship is required.',

            'family.guardians.*.highest_educ_attainment.required' =>
                'Highest educational attainment is required.',
            'family.guardians.*.highest_educ_attainment.in' =>
                'Selected educational attainment is invalid.',

            'family.guardians.*.life_status.required' =>
                'Life status is required.',
            'family.guardians.*.life_status.in' =>
                'Life status must be either Living or Deceased.',

            'family.guardians.*.address.island.required' =>
                'Island is required.',
            'family.guardians.*.address.region.required' =>
                'Region is required.',
            'family.guardians.*.address.province.required' =>
                'Province is required.',
            'family.guardians.*.address.city.required' =>
                'City is required.',
            'family.guardians.*.address.brgy.required' =>
                'Barangay is required.',
            'family.guardians.*.address.zip_code.required' =>
                'ZIP code is required.',
            'family.guardians.*.address.zip_code.digits' =>
                'ZIP code must be exactly 4 digits.',
        ];
    }


}

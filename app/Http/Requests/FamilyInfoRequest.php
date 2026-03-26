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

        $has_siblings = count($this->input('siblings', [])) > 0;

        return [

            'family.family_size' => 'required|integer|min:1|max:25',
            'family.parent_martial_status' => 'required|max:50',
            'family.nature_residence' => 'required|max:50',

            'family.house_monthly_income' => [
                'required',
                Rule::in($validHouseMonthlyIncome)
            ],

            'family.ordinal_position' => 'required|max:50',

            'siblings' => [
                Rule::requiredIf($has_siblings),
                'array',
            ],

            'siblings.*.fname' => [
                Rule::requiredIf($has_siblings),

                'max:150'
            ],

            'siblings.*.lname' => [
                Rule::requiredIf($has_siblings),

                'max:150'
            ],

            'siblings.*.gender' => [
                Rule::requiredIf($has_siblings),
                'string',
                'in:Male,Female'
            ],

            'siblings.*.mname' => 'nullable|max:50',
            'siblings.*.suffix' => ['nullable', Rule::in($validSuffixes)],

            // Guardians Inputs
            'guardians.*.fname' => 'required|string|max:50',
            'guardians.*.mname' => 'nullable|string|max:50',
            'guardians.*.lname' => 'required|string|max:50',
            'guardians.*.suffix' => ['nullable', Rule::in($validSuffixes)],

            'guardians.*.birthdate' => 'required|date',
            'guardians.*.birthplace' => 'nullable|string|max:150',
            'guardians.*.mobile_num' => [
                'nullable',
                'required_if:guardians.*.is_contact_person,true',
                'numeric',
                'starts_with:9',
                'digits:10',
            ],

            'guardians.*.religion' => [
                'required',
                Rule::in($validReligion)
            ],
            'guardians.*.citizenship' => 'required|string|max:50',
            'guardians.*.highest_educ_attainment' => [
                'required',
                Rule::in($validEducationalAttainment),
                'string'
            ],
            'guardians.*.life_status' => ['required', 'string', Rule::in($validLifeStatus)],
            'guardians.*.is_contact_person' => 'boolean',
            'guardians' => [
                function ($attribute, $value, $fail) {
                    $count = collect($value)->where('is_contact_person', true)->count();
                    if ($count !== 1) {
                        $fail('Please choose atleast one person to be your contact person');
                    }
                }
            ],
            'guardians.*.occupation' => 'nullable|string|max:100',
            'guardians.*.cause_of_death' => 'nullable|required_if:guardians.*.life_status,Deceased|string|max:100',
            'guardians.*.year_of_death' => 'nullable|required_if:guardians.*.life_status,Deceased|digits:4',


            // Address
            'guardians.*.address.island' => ['required', Rule::in(['Luzon', 'Visayas', 'Mindanao'])],
            'guardians.*.address.region' => 'required',
            'guardians.*.address.province' => 'required',
            'guardians.*.address.city' => 'required',
            'guardians.*.address.brgy' => 'required',
            'guardians.*.address.zip_code' => 'required|numeric|digits:4',

        ];
    }

    public function messages(): array
    {
        return [

            // Family Info
            'family.family_size.required' => 'Family size is required.',
            'family.family_size.integer' => 'Family size must be a valid number.',
            'family.family_size.min' => 'Family size must be at least 1.',
            'family.family_size.max' => 'Family maximum size is 25.',

            'family.parent_martial_status.required' => 'Parent marital status is required.',
            'family.nature_residence.required' => 'Nature of residence is required.',

            'family.house_monthly_income.required' => 'Please select your house monthly income.',
            'family.house_monthly_income.in' => 'Selected monthly income is invalid.',

            'family.ordinal_position.required' => 'Ordinal position is required.',
            'siblings.required' => 'Please provide sibling information.',
            'siblings.array' => 'Siblings must be a valid list.',

            'siblings.*.fname.required' => 'Sibling first name is required.',
            'siblings.*.lname.required' => 'Sibling last name is required.',
            'siblings.*.gender.required' => 'Sibling gender is required.',
            'siblings.*.gender.in' => 'Sibling gender must be Male or Female.',

            // Guardians
            'guardians.*.fname.required' => 'Guardian first name is required.',
            'guardians.*.lname.required' => 'Guardian last name is required.',
            'guardians.*.birthdate.required' => 'Guardian birthdate is required.',
            'guardians.*.birthdate.date' => 'Guardian birthdate must be a valid date.',

            'guardians.*.mobile_num.required_if' =>
                'Mobile number is required for the selected contact person.',
            'guardians.*.mobile_num.numeric' =>
                'Mobile number must contain only numbers.',
            'guardians.*.mobile_num.starts_with' =>
                'Mobile number must start with 9.',
            'guardians.*.mobile_num.digits' =>
                'Mobile number must be exactly 10 digits.',

            'guardians.*.religion.required' => 'Religion is required.',
            'guardians.*.religion.in' => 'Selected religion is invalid.',

            'guardians.*.citizenship.required' => 'Citizenship is required.',

            'guardians.*.highest_educ_attainment.required' =>
                'Highest educational attainment is required.',
            'guardians.*.highest_educ_attainment.in' =>
                'Selected educational attainment is invalid.',

            'guardians.*.life_status.required' =>
                'Life status is required.',
            'guardians.*.life_status.in' =>
                'Life status must be either Living or Deceased.',

            'guardians.*.cause_of_death.required_if' => 'The cause of death is required when the guardian is marked as deceased.',
            'guardians.*.cause_of_death.string' => 'The cause of death must be a valid text.',
            'guardians.*.cause_of_death.max' => 'The cause of death may not exceed 100 characters.',

            'guardians.*.year_of_death.required_if' => 'The year of death is required when the guardian is marked as deceased.',
            'guardians.*.year_of_death.digits' => 'The year of death must be exactly 4 digits.',

            'guardians.*.address.island.required' =>
                'Island is required.',
            'guardians.*.address.region.required' =>
                'Region is required.',
            'guardians.*.address.province.required' =>
                'Province is required.',
            'guardians.*.address.city.required' =>
                'City is required.',
            'guardians.*.address.brgy.required' =>
                'Barangay is required.',
            'guardians.*.address.zip_code.required' =>
                'ZIP code is required.',
            'guardians.*.address.zip_code.digits' =>
                'ZIP code must be exactly 4 digits.',
        ];
    }


}

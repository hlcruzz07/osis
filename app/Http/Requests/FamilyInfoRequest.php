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

        // dd($this->all());

        $validHouseMonthlyIncome = $entityRepo->getDropdownsByTitle("Household Monthly Income");
        $validSuffixes = $entityRepo->getDropdownsByTitle("Suffix");
        $validReligion = $entityRepo->getDropdownsByTitle("Religion");
        $validEducationalAttainment = $entityRepo->getDropdownsByTitle("Educational Attainment");
        $validLifeStatus = $entityRepo->getDropdownsByTitle("Life Status");

        $has_siblings = count($this->input('siblings', [])) > 0;

        return [

            // FAMILY
            'family.family_size' => 'required|integer|min:1|max:25',
            'family.parent_martial_status' => ['required', 'max:50'],
            'family.nature_residence' => ['required', 'max:50'],

            'family.house_monthly_income' => [
                'required',
                Rule::in($validHouseMonthlyIncome)
            ],

            'family.ordinal_position' => 'required|max:50',

            // SIBLINGS
            'siblings' => [
                Rule::requiredIf($has_siblings),
                'array',
            ],

            'siblings.*.fname' => [Rule::requiredIf($has_siblings), 'max:150'],
            'siblings.*.lname' => [Rule::requiredIf($has_siblings), 'max:150'],
            'siblings.*.gender' => [
                Rule::requiredIf($has_siblings),
                'string',
                'in:Male,Female'
            ],
            'siblings.*.mname' => 'nullable|max:50',
            'siblings.*.suffix' => ['nullable', Rule::in($validSuffixes)],

            // GUARDIANS BASIC INFO
            'guardians' => ['array', 'required'],

            'guardians.*.fname' => 'required|string|max:50',
            'guardians.*.mname' => 'nullable|string|max:50',
            'guardians.*.lname' => 'required|string|max:50',
            'guardians.*.suffix' => ['nullable', Rule::in($validSuffixes)],

            'guardians.*.birthdate' => 'required|date',
            'guardians.*.birthplace' => 'nullable|string|max:150',

            // FIXED mobile validation (no required_if wildcard)
            'guardians.*.mobile_num' => [
                'nullable',
                'required_if:guardians.*.is_contact_person,true',
                'numeric',
                'starts_with:9',
                'digits:10',
            ],

            'guardians.*.religion' => ['required', Rule::in($validReligion)],
            'guardians.*.citizenship' => 'required|string|max:50',

            'guardians.*.highest_educ_attainment' => [
                'required',
                Rule::in($validEducationalAttainment),
            ],

            'guardians.*.life_status' => ['required', Rule::in($validLifeStatus)],

            'guardians.*.is_contact_person' => ['boolean'],

            // OTHER OPTIONAL FIELDS
            'guardians.*.occupation' => 'nullable|string|max:100',
            'guardians.*.cause_of_death' => 'nullable|string|max:100',
            'guardians.*.year_of_death' => 'nullable|digits:4',

            // ADDRESS
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

            // Family Size
            'family.family_size.required' => 'Family size is required.',
            'family.family_size.integer' => 'Family size must be a valid number.',
            'family.family_size.min' => 'Family size must be at least 1.',
            'family.family_size.max' => 'Family maximum size is 25.',

            // Parent Martial Status
            'family.parent_martial_status.required' => 'Parent martial status is required.',
            'family.parent_martial_status.max' => 'Parent martial status must not exceed 50 characters.',

            // Nature of Residence
            'family.nature_residence.required' => 'Nature of residence is required.',
            'family.nature_residence.max' => 'Nature of residence must not exceed 50 characters.',

            // Monthly Income
            'family.house_monthly_income.required' => 'Please select your house monthly income.',
            'family.house_monthly_income.in' => 'Selected monthly income is invalid.',

            // Ordinal Position
            'family.ordinal_position.required' => 'Ordinal position is required.',
            'family.ordinal_position.max' => 'Ordinal position must not exceed 50 characters.',

            'siblings.required' => 'Please provide sibling information.',
            'siblings.array' => 'Siblings must be a valid list.',

            'siblings.*.fname.required' => 'Sibling first name is required.',
            'siblings.*.lname.required' => 'Sibling last name is required.',
            'siblings.*.gender.required' => 'Sibling gender is required.',
            'siblings.*.gender.in' => 'Sibling gender must be Male or Female.',

            // Guardians
            'guardians.required' => 'Guardian is required. Please add atleast 1 guardian.',
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

            'guardians.*.cause_of_death.string' => 'The cause of death must be a valid text.',
            'guardians.*.cause_of_death.max' => 'The cause of death may not exceed 100 characters.',

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

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $guardians = $this->input('guardians', []);

            $count = collect($guardians)
                ->where('is_contact_person', true)
                ->count();

            if ($count < 1) {
                foreach ($guardians as $index => $guardian) {
                    $validator->errors()->add(
                        "guardians.$index.is_contact_person",
                        'Please select at least one contact person.'
                    );
                }
            }
        });
    }

}

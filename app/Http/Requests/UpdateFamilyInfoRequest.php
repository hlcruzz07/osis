<?php

namespace App\Http\Requests;

use App\Repositories\EntityDropdownRepo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFamilyInfoRequest extends FormRequest
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
        $validParentsMartialStatus = $entityRepo->getDropdownsByTitle("Parents Martial Status");
        $validNatureOfResidence = $entityRepo->getDropdownsByTitle("Nature Of Residence");

        return [

            'family_size' => 'required|integer|min:1|max:25',
            'parent_martial_status' => ['required', 'max:50', Rule::in($validParentsMartialStatus)],
            'nature_residence' => ['required', 'max:50', Rule::in($validNatureOfResidence)],

            'house_monthly_income' => [
                'required',
                Rule::in($validHouseMonthlyIncome)
            ],

            'ordinal_position' => 'required|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'family_size.required' => 'Family size is required.',
            'family_size.integer' => 'Family size must be a valid number.',
            'family_size.min' => 'Family size must be at least 1.',
            'family_size.max' => 'Family size must not exceed 25.',

            'parent_martial_status.required' => 'Parent marital status is required.',
            'parent_martial_status.max' => 'Parent marital status must not exceed 50 characters.',
            'parent_martial_status.in' => 'Selected parent marital status is invalid.',

            'nature_residence.required' => 'Nature of residence is required.',
            'nature_residence.max' => 'Nature of residence must not exceed 50 characters.',
            'nature_residence.in' => 'Selected nature of residence is invalid.',

            'house_monthly_income.required' => 'Household monthly income is required.',
            'house_monthly_income.in' => 'Selected household monthly income is invalid.',

            'ordinal_position.required' => 'Ordinal position is required.',
            'ordinal_position.max' => 'Ordinal position must not exceed 50 characters.',
        ];
    }
}

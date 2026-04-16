<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAddressInfoRequest extends FormRequest
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
            'island' => ['required', Rule::in(['Luzon', 'Visayas', 'Mindanao'])],
            'region' => 'required',
            'province' => 'required',
            'city' => 'required',
            'brgy' => 'required',
            'zip_code' => 'required|numeric|digits:4',
        ];
    }

    public function messages(): array
    {
        return [
            // Island
            'island.required' => 'Please select an island.',
            'island.in' => 'Selected island is invalid. Choose Luzon, Visayas, or Mindanao.',

            // Region
            'region.required' => 'Region is required.',

            // Province
            'province.required' => 'Province is required.',

            // City
            'city.required' => 'City/Municipality is required.',

            // Barangay
            'brgy.required' => 'Barangay is required.',

            // Zip Code
            'zip_code.required' => 'Zip code is required.',
            'zip_code.numeric' => 'Zip code must be numeric.',
            'zip_code.digits' => 'Zip code must be exactly 4 digits.',
        ];
    }
}

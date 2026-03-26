<?php

namespace App\Http\Requests;

use App\Models\Student;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentAddressInfo extends FormRequest
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


            'address.island' => ['required', Rule::in(['Luzon', 'Visayas', 'Mindanao'])],
            'address.region' => 'required',
            'address.province' => 'required',
            'address.city' => 'required',
            'address.brgy' => 'required',
            'address.zip_code' => 'required|numeric|digits:4',
        ];
    }

    public function messages(): array
    {
        return [
            // Email
            'email.email' => 'Please enter a valid email address.',
            'email.max' => 'Email must not exceed 50 characters.',

            // Mobile number
            'mobile_num.numeric' => 'Mobile number must contain numbers only.',
            'mobile_num.starts_with' => 'Mobile number should always starts with 9.',
            'mobile_num.digits' => 'Mobile number must be exactly 10 digits.',

            // Island
            'address.island.required' => 'Please select an island.',
            'address.island.in' => 'Selected island is invalid. Choose Luzon, Visayas, or Mindanao.',

            // Region
            'address.region.required' => 'Region is required.',

            // Province
            'address.province.required' => 'Province is required.',

            // City
            'address.city.required' => 'City/Municipality is required.',

            // Barangay
            'address.brgy.required' => 'Barangay is required.',

            // Zip Code
            'address.zip_code.required' => 'Zip code is required.',
            'address.zip_code.numeric' => 'Zip code must be numeric.',
            'address.zip_code.digits' => 'Zip code must be exactly 4 digits.',
        ];
    }


}

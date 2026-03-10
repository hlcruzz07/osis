<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentContactAddressInfo extends FormRequest
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
            'student.email' => 'nullable|email|max:50|unique:students,email',
            'student.mobile_num' => 'nullable|numeric|starts_with:9|digits:10|unique:students,mobile_num',
            'student.address.island' => ['required', Rule::in(['Luzon', 'Visayas', 'Mindanao'])],
            'student.address.region' => 'required',
            'student.address.province' => 'required',
            'student.address.city' => 'required',
            'student.address.brgy' => 'required',
            'student.address.zip_code' => 'required|numeric|digits:4',
        ];
    }

    public function messages(): array
    {
        return [
            // Email
            'student.email.email' => 'Please enter a valid email address.',
            'student.email.max' => 'Email must not exceed 50 characters.',
            'student.email.unique' => 'This email is already taken.',

            // Mobile number
            'student.mobile_num.numeric' => 'Mobile number must contain numbers only.',
            'student.mobile_num.starts_with' => 'Mobile number should always starts with 9.',
            'student.mobile_num.digits' => 'Mobile number must be exactly 10 digits.',
            'student.mobile_num.unique' => 'This mobile number is already taken.',

            // Island
            'student.address.island.required' => 'Please select an island.',
            'student.address.island.in' => 'Selected island is invalid. Choose Luzon, Visayas, or Mindanao.',

            // Region
            'student.address.region.required' => 'Region is required.',

            // Province
            'student.address.province.required' => 'Province is required.',

            // City
            'student.address.city.required' => 'City/Municipality is required.',

            // Barangay
            'student.address.brgy.required' => 'Barangay is required.',

            // Zip Code
            'student.address.zip_code.required' => 'Zip code is required.',
            'student.address.zip_code.numeric' => 'Zip code must be numeric.',
            'student.address.zip_code.digits' => 'Zip code must be exactly 4 digits.',
        ];
    }
}

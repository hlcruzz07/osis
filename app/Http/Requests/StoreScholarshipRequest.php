<?php

namespace App\Http\Requests;

use App\Models\EntityDropdown;
use Illuminate\Foundation\Http\FormRequest;

class StoreScholarshipRequest extends FormRequest
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
        $rules['scholarships'] = ['array'];
        $rules['scholarships.*.name'] = ['required', 'string', 'max:100'];
        $rules['scholarships.*.type'] = ['nullable', 'string', 'max:100'];
        $scholarshipDefinitions = collect(
            EntityDropdown::where('title', 'Scholarships')->first()?->dropdowns ?? []
        );

        foreach ($this->input('scholarships', []) as $index => $entry) {

            $lookupKey = $entry['key'] ?? $entry['name'] ?? null;

            $definition = $scholarshipDefinitions->firstWhere('name', $lookupKey);

            $requiresType = $definition && count($definition['type'] ?? []) > 0;

            if ($requiresType) {
                $rules["scholarships.$index.type"] = ['required', 'string', 'max:100'];
            }
        }

        return array_merge($rules, [
            'student.social_media_account' => ['nullable', 'url', 'required_without:student.mobile_num'],
            'student.mobile_num' => ['nullable', 'string', 'digits:10', 'starts_with:9', 'required_without:student.social_media_account'],
        ]);
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [

            'scholarships.*.name.required' => 'Please specify the scholarship name.',
            'scholarships.*.type.required' => 'Please select a type for this scholarship.',

            'student.social_media_account.required_without' => 'Please provide at least one contact detail: social media link or mobile number.',
            'student.social_media_account.url' => 'Please enter a valid social media link.',
            'student.mobile_num.required_without' => 'Please provide at least one contact detail: mobile number or social media link.',
            'student.mobile_num.digits' => 'The mobile number must be exactly 10 digits.',
            'student.mobile_num.starts_with' => 'The mobile number must start with 9.',

        ];
    }
}
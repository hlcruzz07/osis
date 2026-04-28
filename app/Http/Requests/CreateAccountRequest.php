<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Services\HashingService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateAccountRequest extends FormRequest
{

    public function __construct(protected HashingService $hashingService)
    {

    }
    public function authorize(): bool
    {
        return true;
    }



    public function rules(): array
    {
        return [
            'email' => [
                'required',
                'email',
                function ($attribute, $value, $fail) {
                    $hashed = $this->hashingService->hashValue(strtolower($value));

                    if (User::where('hashed_email', $hashed)->exists()) {
                        $fail('This email is already registered.');
                    }
                },
            ],
            'name' => 'required|string|max:255',
            'role' => 'required|exists:roles,name',
            'permissions' => 'required|array|min:1',
            'permissions.*' => 'required|exists:permissions,name',
        ];
    }
    public function messages(): array
    {
        return [

            'email.required' => 'Email is required.',
            'email.email' => 'Please provide a valid email address.',

            'name.required' => 'Name is required.',
            'name.string' => 'Name must be a valid string.',
            'name.max' => 'Name may not be greater than 255 characters.',

            'role.required' => 'Role is required.',
            'role.exists' => 'The selected role is invalid.',

            'permissions.required' => 'Permission is required.',
            'permissions.min' => 'Permission must be at least 1.',
            'permissions.*.required' => 'Each permission is required.',
            'permissions.*.exists' => 'One or more selected permissions are invalid.',
        ];
    }

}
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;

class UpdateRoleRequest extends FormRequest
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
        $id = $this->route("id");
        return [
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('roles', 'name')->ignore($id),
            ],
            'permissions' => ['required', 'array', 'min:1'],
            'permissions.*' => [
                'required',
                'string',
                Rule::in(Permission::pluck('name')->toArray()),
            ],
        ];
    }
}

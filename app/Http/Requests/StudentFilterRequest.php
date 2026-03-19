<?php

namespace App\Http\Requests;

use App\Repositories\EntityDropdownRepo;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StudentFilterRequest extends FormRequest
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
        $validCampuses = $entityRepo->getDropdownsByTitle("Campuses");

        return [
            'search' => 'nullable|string|max:50',
            'academic_year' => 'nullable|string|max:20',
            'semester' => 'nullable|string|max:20',
            'year_level' => 'nullable|string|max:20',
            'campus' => ['nullable', 'string', Rule::in($validCampuses)],
            'course' => 'nullable|string|max:20',
            'date_admitte_from' => 'nullable|date',
            'date_admitte_to' => 'nullable|date',
            'student_type' => 'nullable|string|max:20',
            'equity_indicator' => 'nullable|string|max:20',
            'sexual_orient' => 'nullable|string|max:20',
            'sort' => 'nullable|in:id,created_at,campus_hash,course_hash',
            'order' => 'nullable|in:asc,desc',
            'show' => 'nullable|in:10,25,50,100,150,200|integer',
        ];
    }
}

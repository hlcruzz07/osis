<?php

namespace App\Http\Requests;

use App\Models\AcademicYearAndSemester;
use App\Models\Student;
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
        $validCourses = $entityRepo->getDropdownsByTitle("Courses");
        $validStudentType = $entityRepo->getDropdownsByTitle("Student Type");
        $validEquityIndicator = $entityRepo->getDropdownsByTitle("Equity Indicator");
        $validStudentStatus = $entityRepo->getDropdownsByTitle("Student Status");


        return [
            'search' => 'nullable|string|max:50',
            'academic_year' => ['nullable', 'string'],
            'semester' => ['nullable', 'string'],
            'year_level' => 'nullable|string|max:20',
            'equity_indicator' => ['nullable', Rule::in($validEquityIndicator)],
            'campus' => ['nullable', 'string', Rule::in($validCampuses)],
            'course' => ['nullable', 'string', Rule::in($validCourses)],
            'status' => ['nullable', 'string', Rule::in($validStudentStatus)],
            'date_admitted_from' => 'nullable|date',
            'date_admitted_to' => 'nullable|date',
            'student_type' => ['nullable', 'string', Rule::in($validStudentType)],
            'sort' => 'nullable|in:id,created_at,campus_hash,course_hash',
            'order' => 'nullable|in:asc,desc',
            'show' => 'nullable|in:10,25,50,100,150,200|integer',
        ];
    }
}

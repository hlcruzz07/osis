<?php

namespace App\Repositories;

use App\Models\AcademicYearAndSemester;

class AcademicYearAndSemesterRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected AcademicYearAndSemester $model)
    {
    }

    /**
     * Generate SHA256 hash of a value
     */
    protected function hashValue(?string $value): ?string
    {
        if (is_null($value) || $value === '') {
            return null;
        }
        return hash('sha256', $value);
    }

    public function all()
    {
        return $this->model->get();
    }

    public function getLatest()
    {
        return $this->model->latest()->first();
    }

    public function store(string $academic_year, string $semester)
    {
        return $this->model->create([
            'academic_year' => $academic_year,
            'semester' => $semester,
        ]);
    }
}

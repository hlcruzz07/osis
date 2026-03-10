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

    public function all()
    {
        return $this->model->get();
    }

    public function getLatest()
    {
        return $this->model->latest()->first();
    }
}

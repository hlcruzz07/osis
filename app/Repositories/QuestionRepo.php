<?php

namespace App\Repositories;

use App\Models\Question;

class QuestionRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Question $model)
    {
    }


    public function all()
    {
        return $this->model->with(['subQuestions.selectItems', 'selectItems'])->get();
    }

    public function getActive()
    {
        return $this->model->with(['subQuestions.selectItems', 'selectItems'])->where('is_active', true)->get();
    }
}

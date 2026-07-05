<?php

namespace App\Repositories;

use App\Models\Education;
use App\Services\HashingService;

class EducationRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Education $model, protected HashingService $hashingService)
    {
        //
    }

    public function store(array $data, int $student_id)
    {
        foreach ($data as $item) {

            $payload = array_merge($item, [
                'student_id' => $student_id
            ]);

            $this->model->create(
                $this->hashingService->appendHashValues($payload, 'student_id')
            );
        }
    }

    public function createIfNotExists(array $item, int $student_id): void
    {
        $exists = $this->model
            ->where('student_id', $student_id)
            ->where('education_level_hash', $this->hashingService->hashValue($item['education_level']))
            ->exists();

        if (!$exists) {
            $this->store([$item], $student_id);
        }
    }
}

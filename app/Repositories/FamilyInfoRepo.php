<?php

namespace App\Repositories;

use App\Models\FamilyInfo;
use App\Services\HashingService;

class FamilyInfoRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected FamilyInfo $model, protected HashingService $hashingService)
    {
        //
    }

    public function store(array $data, int $student_id)
    {
        $payload = array_merge($data, [
            'student_id' => $student_id
        ]);

        $this->model->create(
            $this->hashingService->appendHashValues($payload, 'student_id')
        );
    }

    public function update(int $student_id, array $data)
    {
        $familyInfo = $this->model->where('student_id', $student_id)->first();

        $familyInfo->update($this->hashingService->appendHashValues($data));

        return $familyInfo;
    }
}

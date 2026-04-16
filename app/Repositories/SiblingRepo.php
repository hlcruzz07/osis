<?php

namespace App\Repositories;

use App\Models\Sibling;
use App\Services\HashingService;

class SiblingRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Sibling $model, protected HashingService $hashingService)
    {
        //
    }

    public function storeSiblings(array $data, int $student_id)
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
}

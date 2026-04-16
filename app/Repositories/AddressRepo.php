<?php

namespace App\Repositories;

use App\Models\Address;
use App\Services\HashingService;

class AddressRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Address $model, protected HashingService $hashingService)
    {
        //
    }

    public function updateAddressByStudentId(int $student_id, array $data)
    {
        $address = $this->model->where('student_id', $student_id)->first();

        $address->update($this->hashingService->appendHashValues($data));

        return $address;
    }

    public function updateAddressByGuardianId(int $guardian_id, array $data)
    {
        $address = $this->model->where('guardian_id', $guardian_id)->first();

        $address->update($this->hashingService->appendHashValues($data));

        return $address;
    }


    public function storeStudentAddress(array $data, int $student_id)
    {
        $payload = array_merge($data, [
            'student_id' => $student_id
        ]);

        $this->model->create(
            $this->hashingService->appendHashValues($payload, 'student_id')
        );
    }
}

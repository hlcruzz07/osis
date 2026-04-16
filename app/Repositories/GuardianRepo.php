<?php

namespace App\Repositories;

use App\Models\Address;
use App\Models\Guardian;
use App\Services\HashingService;
use Carbon\Carbon;
use Illuminate\Support\Arr;

class GuardianRepo
{

    public function __construct(protected Guardian $model, protected Address $address, protected HashingService $hashingService)
    {
    }


    public function store(array $data, int $student_id)
    {

        $guardians = isset($data[0]) ? $data : [$data];

        foreach ($guardians as $item) {
            $guardianData = array_merge(
                [
                    'student_id' => $student_id,
                ],
                $this->hashingService->appendHashValues($item, 'student_id')
            );

            $guardian = $this->model->create($guardianData);

            if (!empty($item['address'])) {
                $this->storeAddress($item['address'], $guardian->id);
            }
        }
    }

    protected function storeAddress(array $data, int $id)
    {
        $this->address->create(
            array_merge(
                ['guardian_id' => $id],
                $this->hashingService->appendHashValues($data, ['guardian_id'])
            )
        );
    }

    public function updateGuardianById(int $id, array $data)
    {
        $guardian = $this->model->findOrFail($id);

        if ($data['is_contact_person']) {
            $this->disableContactPersonByStudentId($guardian->student_id, $id);
        }

        $guardian->update(
            $this->hashingService->appendHashValues(Arr::except($data, 'address'))
        );

        $this->updateAddress($id, $data['address']);


        return $guardian;
    }

    public function updateAddress(int $id, array $data)
    {
        $address = $this->address->where([
            'guardian_id' => $id
        ])->first();

        $address->update(
            $this->hashingService->appendHashValues($data)
        );

        return $address;
    }

    public function hasOtherGuardianContact(int $excludeGuardianId): bool
    {
        $guardian = $this->model->findOrFail($excludeGuardianId);

        return $this->model
            ->where('student_id', $guardian->student_id)
            ->where('is_contact_person', true)
            ->where('id', '!=', $excludeGuardianId)
            ->exists();
    }

    protected function disableContactPersonByStudentId(int $studentId, int $exeptId)
    {
        $this->model
            ->where('student_id', $studentId)
            ->where('is_contact_person', true)
            ->where('id', '!=', $exeptId)
            ->update([
                'is_contact_person' => false,
            ]);
    }

    public function hasExistingGuardian(int $student_id, string $role)
    {
        return $this->model
            ->where('student_id', $student_id)
            ->where('role_hash', $this->hashingService->hashValue($role))
            ->exists();
    }


}

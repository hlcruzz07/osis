<?php

namespace App\Repositories;

use App\Models\Address;
use App\Models\Guardian;
use Carbon\Carbon;

class GuardianRepo
{

    public function __construct(protected Guardian $model, protected Address $address)
    {
    }

    public function store(array $data, int $student_id)
    {
        foreach ($data as $item) {

            $guardian = $this->model->create([
                'student_id' => $student_id,
                'fname' => $item['fname'],
                'mname' => $item['mname'] ?? null,
                'lname' => $item['lname'],
                'suffix' => $item['suffix'] ?? null,
                'role' => $item['role'],
                'birthdate' => $item['birthdate'],
                'birthplace' => $item['birthplace'] ?? null,
                'mobile_num' => $item['mobile_num'] ?? null,
                'religion' => $item['religion'],
                'citizenship' => $item['citizenship'],
                'highest_educ_attainment' => $item['highest_educ_attainment'],
                'life_status' => $item['life_status'],
                'cause_of_death' => $item['cause_of_death'] ?? null,
                'year_of_death' => $item['year_of_death'] ?? null,
                'occupation' => $item['occupation'] ?? null,
                'is_contact_person' => $item['is_contact_person'],
            ]);

            $id = $guardian->id;

            $this->storeAddress($item['address'], $id);

        }

    }

    public function storeAddress(array $data, int $id)
    {
        $this->address->create([
            'guardian_id' => $id,
            'island' => $data['island'],
            'region' => $data['region'],
            'province' => $data['province'],
            'city' => $data['city'],
            'brgy' => $data['brgy'],
            'zip_code' => $data['zip_code'],
        ]);
    }

}

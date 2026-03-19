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
                'fname_hash' => $this->hashValue($item['fname'] ?? null),
                'mname_hash' => $this->hashValue($item['mname'] ?? null),
                'lname_hash' => $this->hashValue($item['lname'] ?? null),
                'suffix_hash' => $this->hashValue($item['suffix'] ?? null),
                'role_hash' => $this->hashValue($item['role'] ?? null),
                'birthdate_hash' => $this->hashValue($item['birthdate'] ?? null),
                'birthplace_hash' => $this->hashValue($item['birthplace'] ?? null),
                'mobile_num_hash' => $this->hashValue($item['mobile_num'] ?? null),
                'religion_hash' => $this->hashValue($item['religion'] ?? null),
                'citizenship_hash' => $this->hashValue($item['citizenship'] ?? null),
                'highest_educ_attainment_hash' => $this->hashValue($item['highest_educ_attainment'] ?? null),
                'life_status_hash' => $this->hashValue($item['life_status'] ?? null),
                'cause_of_death_hash' => $this->hashValue($item['cause_of_death'] ?? null),
                'year_of_death_hash' => $this->hashValue($item['year_of_death'] ?? null),
                'occupation_hash' => $this->hashValue($item['occupation'] ?? null),
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
            'island_hash' => $this->hashValue($data['island'] ?? null),
            'region_hash' => $this->hashValue($data['region'] ?? null),
            'province_hash' => $this->hashValue($data['province'] ?? null),
            'city_hash' => $this->hashValue($data['city'] ?? null),
            'brgy_hash' => $this->hashValue($data['brgy'] ?? null),
            'zip_code_hash' => $this->hashValue($data['zip_code'] ?? null),
        ]);
    }

}

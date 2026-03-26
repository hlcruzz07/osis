<?php

namespace App\Repositories;

use App\Models\Address;
use App\Models\Education;
use App\Models\FamilyInfo;
use App\Models\Guardian;
use App\Models\Sibling;
use App\Models\Student;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class StudentRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Student $model, protected Address $address, protected Sibling $sibling, protected GuardianRepo $guardianRepo, protected Education $education, protected AnswerRepo $answerRepo, protected FamilyInfo $familyInfo)
    {
    }

    public function getStudentById(int $id)
    {
        return $this->model
            ->with(['guardians', 'address', 'educations', 'siblings', 'answers', 'subAnswers'])
            ->findOrFail($id);
    }

    // public function updateStudentInfoById(int $id, array $data)
    // {
    //     DB::transaction(function () use ($id, $data) {
    //         $student = $this->model->findOrFail($id);
    //         $student->update([
    //             'year_level' => $data['year_level'],
    //             'campus' => $data['campus'],
    //             'date_admitted' => $data['date_admitted'],
    //             'student_type' => $data['student_type'],
    //             'course' => $data['course'],
    //             'lrn' => $data['lrn'] ?? null,
    //             'equity_indicator' => $data['equity_indicator'],

    //             'year_level_hash' => $this->hashValue($data['year_level']),
    //             'campus_hash' => $this->hashValue($data['campus']),
    //             'date_admitted_hash' => $this->hashValue($data['date_admitted']),
    //             'student_type_hash' => $this->hashValue($data['student_type']),
    //             'course_hash' => $this->hashValue($data['course']),
    //             'lrn_hash' => $this->hashValue($data['lrn']),
    //             'equity_indicator_hash' => $this->hashValue($data['equity_indicator']),
    //         ]);

    //         $this->updateEducations($id, $data['educations']);

    //         return $student;
    //     });
    // }


    // public function updatePersonalInfoById(int $id, array $data)
    // {
    //     DB::transaction(function () use ($id, $data) {
    //         $student = $this->model->findOrFail($id);
    //         $student->update([
    //             'year_level' => $data['year_level'],
    //             'campus' => $data['campus'],
    //             'date_admitted' => $data['date_admitted'],
    //             'student_type' => $data['student_type'],
    //             'course' => $data['course'],
    //             'lrn' => $data['lrn'] ?? null,
    //             'equity_indicator' => $data['equity_indicator'],

    //             'year_level_hash' => $this->hashValue($data['year_level']),
    //             'campus_hash' => $this->hashValue($data['campus']),
    //             'date_admitted_hash' => $this->hashValue($data['date_admitted']),
    //             'student_type_hash' => $this->hashValue($data['student_type']),
    //             'course_hash' => $this->hashValue($data['course']),
    //             'lrn_hash' => $this->hashValue($data['lrn']),
    //             'equity_indicator_hash' => $this->hashValue($data['equity_indicator']),
    //         ]);

    //         $this->updateEducations($id, $data['educations']);

    //         return $student;
    //     });
    // }

    // public function updateEducations(int $id, array $data)
    // {
    //     DB::transaction(function () use ($id, $data) {
    //         $data_with_hashes = array_merge($data, [
    //             'fname_hash' => $this->hashValue($data['fname'] ?? null),
    //             'mname_hash' => $this->hashValue($data['mname'] ?? null),
    //             'lname_hash' => $this->hashValue($data['lname'] ?? null),
    //             'suffix_hash' => $this->hashValue($data['suffix'] ?? null),
    //             'birthdate_hash' => $this->hashValue($data['birthdate'] ?? null),
    //             'birthplace_hash' => $this->hashValue($data['birthplace'] ?? null),
    //             'weekly_allowance_hash' => $this->hashValue($data['weekly_allowance'] ?? null),
    //             'financer_hash' => $this->hashValue($data['financer'] ?? null),
    //             'last_attended_school_hash' => $this->hashValue($data['last_attended_school'] ?? null),
    //             'email_hash' => $this->hashValue($data['email'] ?? null),
    //             'mobile_num_hash' => $this->hashValue($data['mobile_num'] ?? null),
    //             'religion_hash' => $this->hashValue($data['religion'] ?? null),
    //             'citizenship_hash' => $this->hashValue($data['citizenship'] ?? null),
    //             'civil_status_hash' => $this->hashValue($data['civil_status'] ?? null),
    //             'sexual_orient_hash' => $this->hashValue($data['sexual_orient'] ?? null),
    //             'height_hash' => $this->hashValue($data['height'] ?? null),
    //             'weight_hash' => $this->hashValue($data['weight'] ?? null),
    //         ]);

    //         $student = $this->model->findOrFail($id);
    //         $student->update($data_with_hashes);

    //         $address = $this->address->where('student_id', $id);
    //         $address->update($data['address']);

    //         return true;
    //     });
    // }

    public function paginate(array $filters)
    {

        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $this->hashValue($filters['search']);

            $query->where(function ($q) use ($search) {
                $q->where('email_hash', $search)
                    ->orWhere('mobile_num_hash', $search)
                    ->orWhere('fname_hash', $search)
                    ->orWhere('lname_hash', $search)
                    ->orWhere('suffix_hash', $search);
            });

        }

        if (!empty($filters['academic_year'])) {
            $query->where('academic_year_hash', $this->hashValue($filters['academic_year']));
        }

        if (!empty($filters['semester'])) {
            $query->where('semester_hash', $this->hashValue($filters['semester']));
        }

        if (!empty($filters['year_level'])) {
            $query->where('year_level_hash', $this->hashValue($filters['year_level']));
        }

        if (!empty($filters['campus'])) {
            $query->where('campus_hash', $this->hashValue($filters['campus']));
        }

        if (!empty($filters['course'])) {
            $query->where('course_hash', $this->hashValue($filters['course']));
        }

        if (!empty($filters['date_admitte_from']) && !empty($filters['date_admitte_to'])) {
            if ($filters['date_admitte_from'] === $filters['date_admitte_to']) {
                $query->whereDate('created_at', '=', $filters['date_admitte_from']);
            } else {
                $query->whereBetween('created_at', [
                    $filters['date_admitte_from'],
                    $filters['date_admitte_to'],
                ]);
            }
        }

        if (!empty($filters['student_type'])) {
            $query->where('student_type_hash', $this->hashValue($filters['student_type']));
        }

        if (!empty($filters['equity_indicator'])) {
            $query->where('equity_indicator_hash', $this->hashValue($filters['equity_indicator']));
        }

        if (!empty($filters['sexual_orient'])) {
            $query->where('sexual_orient_hash', $this->hashValue($filters['sexual_orient']));
        }

        $sort = $filters['sort'] ?? 'id';
        $order = $filters['order'] ?? 'desc';

        $query->orderBy($sort, $order);

        $show = $filters['show'] ?? 10;

        return $query->paginate($show);
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

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }


    public function storeStudent(array $data)
    {
        // Add hash columns for all string fields
        $data_with_hashes = array_merge($data, [
            'academic_year_hash' => $this->hashValue($data['academic_year'] ?? null),
            'semester_hash' => $this->hashValue($data['semester'] ?? null),
            'lrn_hash' => $this->hashValue($data['lrn'] ?? null),
            'year_level_hash' => $this->hashValue($data['year_level'] ?? null),
            'campus_hash' => $this->hashValue($data['campus'] ?? null),
            'course_hash' => $this->hashValue($data['course'] ?? null),
            'date_admitted_hash' => $this->hashValue($data['date_admitted'] ?? null),
            'student_type_hash' => $this->hashValue($data['student_type'] ?? null),
            'equity_indicator_hash' => $this->hashValue($data['equity_indicator'] ?? null),
            'fname_hash' => $this->hashValue($data['fname'] ?? null),
            'mname_hash' => $this->hashValue($data['mname'] ?? null),
            'lname_hash' => $this->hashValue($data['lname'] ?? null),
            'suffix_hash' => $this->hashValue($data['suffix'] ?? null),
            'birthdate_hash' => $this->hashValue($data['birthdate'] ?? null),
            'birthplace_hash' => $this->hashValue($data['birthplace'] ?? null),
            'weekly_allowance_hash' => $this->hashValue($data['weekly_allowance'] ?? null),
            'financer_hash' => $this->hashValue($data['financer'] ?? null),
            'last_attended_school_hash' => $this->hashValue($data['last_attended_school'] ?? null),
            'email_hash' => $this->hashValue($data['email'] ?? null),
            'mobile_num_hash' => $this->hashValue($data['mobile_num'] ?? null),
            'religion_hash' => $this->hashValue($data['religion'] ?? null),
            'citizenship_hash' => $this->hashValue($data['citizenship'] ?? null),
            'civil_status_hash' => $this->hashValue($data['civil_status'] ?? null),
            'sexual_orient_hash' => $this->hashValue($data['sexual_orient'] ?? null),
            'height_hash' => $this->hashValue($data['height'] ?? null),
            'weight_hash' => $this->hashValue($data['weight'] ?? null),
        ]);

        $student = $this->model->create($data_with_hashes);

        return $student->id;
    }

    public function storeStudentAddress(array $data, int $id)
    {

        $this->address->create([
            'student_id' => $id,
            'island' => $data['island'],
            'region' => $data['region'],
            'province' => $data['province'],
            'city' => $data['city'],
            'brgy' => $data['brgy'],
            'zip_code' => $data['zip_code'] ?? null,

            'island_hash' => $this->hashValue($data['island'] ?? null),
            'region_hash' => $this->hashValue($data['region'] ?? null),
            'province_hash' => $this->hashValue($data['province'] ?? null),
            'city_hash' => $this->hashValue($data['city'] ?? null),
            'brgy_hash' => $this->hashValue($data['brgy'] ?? null),
            'zip_code_hash' => $this->hashValue($data['zip_code'] ?? null),
        ]);
    }

    public function storeStudentEducations(array $data, int $id)
    {

        foreach ($data as $item) {

            $this->education->create([
                'student_id' => $id,
                'education_level' => $item['education_level'],
                'school_name' => $item['school_name'],
                'school_address' => $item['school_address'],
                'school_type' => $item['school_type'],
                'year_graduated' => $item['year_graduated'],
                'general_average' => $item['general_average'],
                'strand' => $item['strand'] ?? null,
                'course' => $item['course'] ?? null,
                'academic_year' => $item['academic_year'] ?? null,
                'scholarship_program' => $item['scholarship_program'] ?? null,
                'scholarship_address' => $item['scholarship_address'] ?? null,
                'scholarship_mobile_num' => $item['scholarship_mobile_num'] ?? null,

                'education_level_hash' => $this->hashValue($item['education_level'] ?? null),
                'school_name_hash' => $this->hashValue($item['school_name'] ?? null),
                'school_address_hash' => $this->hashValue($item['school_address'] ?? null),
                'school_type_hash' => $this->hashValue($item['school_type'] ?? null),
                'year_graduated_hash' => $this->hashValue($item['year_graduated'] ?? null),
                'general_average_hash' => $this->hashValue($item['general_average'] ?? null),
                'strand_hash' => $this->hashValue($item['strand'] ?? null),
                'course_hash' => $this->hashValue($item['course'] ?? null),
                'academic_year_hash' => $this->hashValue($item['academic_year'] ?? null),
                'scholarship_program_hash' => $this->hashValue($item['scholarship_program'] ?? null),
                'scholarship_address_hash' => $this->hashValue($item['scholarship_address'] ?? null),
                'scholarship_mobile_num_hash' => $this->hashValue($item['scholarship_mobile_num'] ?? null),
            ]);
        }

    }

    public function storeFamilyInfo(array $data, int $id)
    {
        $this->familyInfo->create([
            'student_id' => $id,
            'family_size' => $data['family_size'],
            'parent_martial_status' => $data['parent_martial_status'],
            'nature_residence' => $data['nature_residence'],
            'house_monthly_income' => $data['house_monthly_income'],
            'ordinal_position' => $data['ordinal_position'],

            'family_size_hash' => $this->hashValue($data['family_size'] ?? null),
            'parent_martial_status_hash' => $this->hashValue($data['parent_martial_status'] ?? null),
            'nature_residence_hash' => $this->hashValue($data['nature_residence'] ?? null),
            'house_monthly_income_hash' => $this->hashValue($data['house_monthly_income'] ?? null),
            'ordinal_position_hash' => $this->hashValue($data['ordinal_position'] ?? null),
        ]);
    }

    public function storeSiblings(array $data, int $id)
    {
        foreach ($data as $item) {

            $this->sibling->create([
                'student_id' => $id,
                'fname' => $item['fname'],
                'mname' => $item['mname'] ?? null,
                'lname' => $item['lname'],
                'suffix' => $item['suffix'] ?? null,
                'is_attending_college' => $item['is_attending_college'],
                'is_employed' => $item['is_employed'],
                'fname_hash' => $this->hashValue($item['fname'] ?? null),
                'mname_hash' => $this->hashValue($item['mname'] ?? null),
                'lname_hash' => $this->hashValue($item['lname'] ?? null),
                'suffix_hash' => $this->hashValue($item['suffix'] ?? null),
            ]);
        }

    }







    protected function encryptData(mixed $data)
    {
        dd(encrypt($data));
    }

    protected function decryptData(mixed $data)
    {
        dd(decrypt($data));
    }


    public function isStudentSubmitted(string $fname, string $lname)
    {
        return $this->model->where('fname', $fname)->where('lname', $lname)->exists();
    }

}

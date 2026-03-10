<?php

namespace App\Repositories;

use App\Models\Address;
use App\Models\Education;
use App\Models\Guardian;
use App\Models\Sibling;
use App\Models\Student;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class StudentRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Student $model, protected Address $address, protected Sibling $sibling, protected GuardianRepo $guardianRepo, protected Education $education, protected AnswerRepo $answerRepo)
    {
    }

    public function find(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function store(array $data)
    {
        $student_data =
            Arr::except($data, [
                'education',
                'family',
                'answers',
                'is_agree',
                'student.address'
            ])['student'];

        $address_data = data_get($data, 'student.address');
        $education_data = collect(data_get($data, 'education'))->filter()->values()->toArray();
        $guardians_data = data_get($data, 'family.guardians');
        $siblings_data = data_get($data, 'family.siblings');
        $answers_data = data_get($data, 'answers');

        $student_main_answers = collect($answers_data)->filter(function ($item) {
            return is_null($item['sub_question_id']);
        })->values()->toArray();

        $student_sub_answers = collect($answers_data)->filter(function ($item) {
            return !is_null($item['sub_question_id']) && !is_null($item['answer']);
        })->values()->toArray();

        dd($guardians_data);
        // INSERTIONS 
        $student_id = $this->storeStudent($student_data);
        $this->storeStudentAddress($address_data, $student_id);
        $this->storeSiblings($siblings_data, $student_id);
        $this->storeStudentEducation($education_data, $student_id);
        $this->guardianRepo->store($guardians_data, $student_id);
        $this->answerRepo->storeAnswers($student_main_answers, $student_id);
        $this->answerRepo->storeSubAnswers($student_sub_answers, $student_id);


    }

    public function storeStudent(array $data)
    {

        $student = $this->model->create($data);

        return $student->id;
    }

    public function storeStudentAddress(array $data, int $id)
    {
        $now = Carbon::now();

        $this->address->insert([
            'student_id' => $id,
            'island' => $data['island'],
            'region' => $data['region'],
            'province' => $data['province'],
            'city' => $data['city'],
            'brgy' => $data['brgy'],
            'zip_code' => $data['zip_code'],
            'created_at' => $now,
            'updated_at' => $now
        ]);
    }

    public function storeSiblings(array $data, int $id)
    {
        foreach ($data as $item) {

            $this->sibling->insert([
                'student_id' => $id,
                'fname' => $item['fname'],
                'mname' => $item['mname'] ?? null,
                'lname' => $item['lname'],
                'suffix' => $item['suffix'] ?? null,
                'is_attending_college' => $item['is_attending_college'],
                'is_employed' => $item['is_employed'],
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);
        }

    }



    public function storeStudentEducation(array $data, int $id)
    {
        $now = Carbon::now();

        $final_data = collect($data)
            ->filter()
            ->map(function ($item) use ($id, $now) {
                return [
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

                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            })
            ->values()
            ->toArray();

        $this->education->insert($final_data);
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

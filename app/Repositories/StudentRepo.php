<?php

namespace App\Repositories;

use App\Models\Education;
use App\Models\FamilyInfo;
use App\Models\Guardian;
use App\Models\Sibling;
use App\Models\Student;
use App\Services\HashingService;
use Illuminate\Database\Eloquent\Collection;

class StudentRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Student $model, protected Sibling $sibling, protected Guardian $guardian, protected Education $education, protected AnswerRepo $answerRepo, protected FamilyInfo $familyInfo, protected HashingService $hashingService)
    {
    }


    // CREATE QUERIES
    public function storeStudent(array $data)
    {
        $student = $this->model->create($this->hashingService->appendHashValues($data));

        return $student->id;
    }


    // FETCH QUERIES

    public function find(int $id)
    {
        return $this->model
            ->with(['guardians.address', 'address', 'educations', 'siblings', 'answers.question', 'subAnswers.subQuestion', 'familyInfo'])
            ->findOrFail($id);
    }

    public function paginate(array $filters)
    {

        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $this->hashingService->hashValue($filters['search']);

            $query->where(function ($q) use ($search) {
                $q->where('email_hash', $search)
                    ->orWhere('mobile_num_hash', $search)
                    ->orWhere('fname_hash', $search)
                    ->orWhere('lname_hash', $search)
                    ->orWhere('suffix_hash', $search);
            });

        }

        if (!empty($filters['academic_year'])) {
            $query->where('academic_year_hash', $this->hashingService->hashValue($filters['academic_year']));
        }

        if (!empty($filters['semester'])) {
            $query->where('semester_hash', $this->hashingService->hashValue($filters['semester']));
        }

        if (!empty($filters['year_level'])) {
            $query->where('year_level_hash', $this->hashingService->hashValue($filters['year_level']));
        }

        if (!empty($filters['campus'])) {
            $query->where('campus_hash', $this->hashingService->hashValue($filters['campus']));
        }

        if (!empty($filters['course'])) {
            $query->where('course_hash', $this->hashingService->hashValue($filters['course']));
        }

        if (!empty($filters['date_admitted_from']) && !empty($filters['date_admitted_to'])) {
            if ($filters['date_admitted_from'] === $filters['date_admitted_to']) {
                $query->whereDate('created_at', '=', $filters['date_admitted_from']);
            } else {
                $query->whereBetween('created_at', [
                    $filters['date_admitted_from'],
                    $filters['date_admitted_to'],
                ]);
            }
        }

        if (!empty($filters['student_type'])) {
            $query->where('student_type_hash', $this->hashingService->hashValue($filters['student_type']));
        }

        $sort = $filters['sort'] ?? 'id';
        $order = $filters['order'] ?? 'desc';

        $query->orderBy($sort, $order);

        $show = $filters['show'] ?? 10;

        return $query->paginate($show);
    }

    public function export(array $filters): Collection
    {
        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $this->hashingService->hashValue($filters['search']);

            $query->where(function ($q) use ($search) {
                $q->where('email_hash', $search)
                    ->orWhere('mobile_num_hash', $search)
                    ->orWhere('fname_hash', $search)
                    ->orWhere('lname_hash', $search)
                    ->orWhere('suffix_hash', $search);
            });
        }

        if (!empty($filters['academic_year'])) {
            $query->where('academic_year_hash', $this->hashingService->hashValue($filters['academic_year']));
        }

        if (!empty($filters['semester'])) {
            $query->where('semester_hash', $this->hashingService->hashValue($filters['semester']));
        }

        if (!empty($filters['year_level'])) {
            $query->where('year_level_hash', $this->hashingService->hashValue($filters['year_level']));
        }

        if (!empty($filters['campus'])) {
            $query->where('campus_hash', $this->hashingService->hashValue($filters['campus']));
        }

        if (!empty($filters['course'])) {
            $query->where('course_hash', $this->hashingService->hashValue($filters['course']));
        }

        if (!empty($filters['date_admitted_from']) && !empty($filters['date_admitted_to'])) {
            if ($filters['date_admitted_from'] === $filters['date_admitted_to']) {
                $query->whereDate('created_at', '=', $filters['date_admitted_from']);
            } else {
                $query->whereBetween('created_at', [
                    $filters['date_admitted_from'],
                    $filters['date_admitted_to'],
                ]);
            }
        }

        if (!empty($filters['student_type'])) {
            $query->where('student_type_hash', $this->hashingService->hashValue($filters['student_type']));
        }

        $query->orderBy($filters['sort'] ?? 'id', $filters['order'] ?? 'desc');

        return $query->with([
            'guardians.address',
            'address',
            'educations',
            'siblings',
            'familyInfo'
        ])->get();
    }

    public function getLatestStudents()
    {
        return $this->model->orderBy('created_at', 'desc')->limit(5)->get();
    }


    // UPDATE QUERIES

    public function updateStudentById(int $id, array $data)
    {
        $student = $this->model->findOrFail($id);

        $student->update($this->hashingService->appendHashValues($data));

        return $student;
    }





    public function updateEducations(array $data)
    {
        foreach ($data['educations'] as $education) {

            $educ = $this->education->findOrFail($education['id']);

            $educ->update(
                $this->hashingService->appendHashValues($education, 'id')
            );
        }
    }



}

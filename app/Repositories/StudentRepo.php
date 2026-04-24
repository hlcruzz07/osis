<?php

namespace App\Repositories;

use App\Models\Education;
use App\Models\EntityDropdown;
use App\Models\FamilyInfo;
use App\Models\Guardian;
use App\Models\Sibling;
use App\Models\Student;
use App\Services\HashingService;
use Carbon\Carbon;
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
                $query->whereDate('created_at', '>=', $filters['date_admitted_from'])
                    ->whereDate('created_at', '<=', $filters['date_admitted_to']);
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

        if (!empty($filters['created_at_from']) && !empty($filters['created_at_to'])) {
            if ($filters['created_at_from'] === $filters['created_at_to']) {
                $query->whereDate('created_at', $filters['created_at_from']);
            } else {
                $query->whereDate('created_at', '>=', $filters['created_at_from'])
                    ->whereDate('created_at', '<=', $filters['created_at_to']);
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

    public function getStudentsCountPerCampus()
    {
        $campuses = ['Talisay', 'Alijis', 'Binalbagan', 'Fortune Towne'];

        // Helper to convert to camelCase
        $toCamelCase = function ($string) {
            return lcfirst(str_replace(' ', '', ucwords($string)));
        };

        // Map campus => hash
        $hashedCampuses = [];
        foreach ($campuses as $campus) {
            $hashedCampuses[$campus] = $this->hashingService->hashValue($campus);
        }

        // Query counts
        $results = $this->model
            ->selectRaw('campus_hash, COUNT(*) as total')
            ->whereIn('campus_hash', array_values($hashedCampuses))
            ->groupBy('campus_hash')
            ->pluck('total', 'campus_hash')
            ->toArray();

        // Build final response with camelCase keys
        $final = [];
        foreach ($hashedCampuses as $campus => $hash) {
            $key = $toCamelCase($campus);
            $final[$key] = $results[$hash] ?? 0;
        }

        return $final;
    }

    public function getStudentsPerDateFilter($date)
    {
        $query = $this->model->query();

        switch ($date) {
            case 'today':
                $query->whereDate('created_at', today());
                $groupBy = 'HOUR';
                $selectRaw = "DATE_FORMAT(created_at, '%Y-%m-%d %H:00') as period_raw, 
                          DATE_FORMAT(created_at, '%H:00') as period";
                $orderBy = 'period_raw';
                break;
            case 'this_week':
                $start = now()->startOfWeek();
                $end = now()->endOfWeek();
                $query->whereBetween('created_at', [$start, $end]);
                $groupBy = 'DATE';
                $selectRaw = "DATE_FORMAT(created_at, '%Y-%m-%d') as period_raw, 
                          DATE_FORMAT(created_at, '%M %D, %Y') as period";
                $orderBy = 'period_raw';
                break;
            case 'this_month':
                $start = now()->startOfMonth();
                $end = now()->endOfMonth();
                $query->whereBetween('created_at', [$start, $end]);
                $groupBy = 'DATE';
                $selectRaw = "DATE_FORMAT(created_at, '%Y-%m-%d') as period_raw, 
                          DATE_FORMAT(created_at, '%M %D, %Y') as period";
                $orderBy = 'period_raw';
                break;
            case 'this_year':
                $start = now()->startOfYear();
                $end = now()->endOfYear();
                $query->whereBetween('created_at', [$start, $end]);
                $groupBy = 'MONTH';
                $selectRaw = "DATE_FORMAT(created_at, '%Y-%m') as period_raw, 
                          DATE_FORMAT(created_at, '%M %Y') as period";
                $orderBy = 'period_raw';
                break;
            default:
                return response()->json(['error' => 'Invalid date filter'], 400);
        }

        $campuses = ['Talisay', 'Fortune Towne', 'Alijis', 'Binalbagan'];

        $hashedCampuses = [];
        foreach ($campuses as $campus) {
            $hashedCampuses[$campus] = $this->hashingService->hashValue($campus);
        }

        // Get grouped data with both raw and formatted dates
        $rows = $query
            ->selectRaw("{$selectRaw}, campus_hash, COUNT(*) as total")
            ->whereIn('campus_hash', array_values($hashedCampuses))
            ->groupBy('period_raw', 'period', 'campus_hash')
            ->orderBy($orderBy)
            ->get();

        // Transform data for chart
        $chartData = [];
        foreach ($rows as $row) {
            foreach ($hashedCampuses as $campus => $hash) {
                if ($row->campus_hash === $hash) {
                    $key = strtolower(str_replace(' ', '_', $campus));

                    // Find or create period entry using period (formatted) as key
                    $periodIndex = null;
                    foreach ($chartData as $index => $data) {
                        if ($data['period'] === $row->period) {
                            $periodIndex = $index;
                            break;
                        }
                    }

                    if ($periodIndex === null) {
                        $newEntry = ['period' => $row->period];
                        foreach ($campuses as $c) {
                            $newEntry[strtolower(str_replace(' ', '_', $c))] = 0;
                        }
                        $newEntry[$key] = $row->total;
                        $chartData[] = $newEntry;
                    } else {
                        $chartData[$periodIndex][$key] = $row->total;
                    }
                }
            }
        }

        return $chartData;
    }

    public function getStudentTypeCount()
    {
        $student_types = ['Shiftee', 'Returnee', 'Continuing', 'Transferee', 'Fresh Graduate'];

        $toCamelCase = function ($string) {
            return lcfirst(str_replace(' ', '', ucwords($string)));
        };

        // Map campus => hash
        $hashTypes = [];
        foreach ($student_types as $types) {
            $hashTypes[$types] = $this->hashingService->hashValue($types);
        }

        // Query counts
        $results = $this->model
            ->selectRaw('student_type_hash, COUNT(*) as total')
            ->whereIn('student_type_hash', array_values($hashTypes))
            ->groupBy('student_type_hash')
            ->pluck('total', 'student_type_hash')
            ->toArray();

        // Build final response with camelCase keys
        $final = [];
        foreach ($hashTypes as $campus => $hash) {
            $key = $toCamelCase($campus);
            $final[$key] = $results[$hash] ?? 0;
        }

        return $final;
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

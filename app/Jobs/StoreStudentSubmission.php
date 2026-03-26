<?php

namespace App\Jobs;

use App\Repositories\AnswerRepo;
use App\Repositories\GuardianRepo;
use App\Repositories\StudentRepo;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class StoreStudentSubmission implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function handle(
        StudentRepo $studentRepo,
        GuardianRepo $guardianRepo,
        AnswerRepo $answerRepo
    ): void {

        DB::transaction(function () use ($studentRepo, $guardianRepo, $answerRepo) {

            // INSERTIONS
            $student_id = $studentRepo->storeStudent($this->data['student']);

            $studentRepo->storeStudentAddress($this->data['address'], $student_id);

            $studentRepo->storeStudentEducations($this->data['educations'], $student_id);

            $studentRepo->storeFamilyInfo($this->data['family'], $student_id);

            if (!empty($this->data['siblings'] && count($this->data['siblings']) > 0)) {
                $studentRepo->storeSiblings($this->data['siblings'], $student_id);
            }

            $guardianRepo->store($this->data['guardians'], $student_id);

            $answerRepo->storeAnswers($this->data['answers'], $student_id);

            if (!empty($this->data['sub_answers'] && count($this->data['sub_answers']) > 0)) {
                $answerRepo->storeSubAnswers($this->data['sub_answers'], $student_id);
            }

        });
    }
}
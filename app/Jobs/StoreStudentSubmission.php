<?php

namespace App\Jobs;

use App\Repositories\AddressRepo;
use App\Repositories\AnswerRepo;
use App\Repositories\EducationRepo;
use App\Repositories\FamilyInfoRepo;
use App\Repositories\GuardianRepo;
use App\Repositories\SiblingRepo;
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
        AnswerRepo $answerRepo,
        FamilyInfoRepo $familyInfoRepo,
        GuardianRepo $guardianRepo,
        AddressRepo $addressRepo,
        SiblingRepo $siblingRepo,
        EducationRepo $educationRepo

    ): void {

        DB::transaction(function () use ($educationRepo, $studentRepo, $guardianRepo, $answerRepo, $addressRepo, $siblingRepo, $familyInfoRepo) {

            // INSERTIONS
            $student_id = $studentRepo->storeStudent($this->data['student']);

            $addressRepo->storeStudentAddress($this->data['address'], $student_id);

            $educationRepo->store($this->data['educations'], $student_id);

            $familyInfoRepo->store($this->data['family'], $student_id);

            if (!empty($this->data['siblings'] && count($this->data['siblings']) > 0)) {
                $siblingRepo->storeSiblings($this->data['siblings'], $student_id);
            }

            $guardianRepo->store($this->data['guardians'], $student_id);

            $answerRepo->storeAnswers($this->data['answers'], $student_id);

            if (!empty($this->data['sub_answers'] && count($this->data['sub_answers']) > 0)) {
                $answerRepo->storeSubAnswers($this->data['sub_answers'], $student_id);
            }

        });
    }
}
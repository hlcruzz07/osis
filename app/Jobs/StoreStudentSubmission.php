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

            $student_data = Arr::except($this->data, [
                'education',
                'family',
                'answers',
                'is_agree',
                'student.address'
            ])['student'];

            $address_data = data_get($this->data, 'student.address');
            $education_data = collect(data_get($this->data, 'education'))->filter()->values()->toArray();
            $guardians_data = data_get($this->data, 'family.guardians');
            $siblings_data = data_get($this->data, 'family.siblings');
            $answers_data = data_get($this->data, 'answers');

            $student_main_answers = collect($answers_data)
                ->filter(fn($item) => is_null($item['sub_question_id']))
                ->values()
                ->toArray();

            $student_sub_answers = collect($answers_data)
                ->filter(fn($item) => !is_null($item['sub_question_id']) && !is_null($item['answer']))
                ->values()
                ->toArray();

            // INSERTIONS
            $student_id = $studentRepo->storeStudent($student_data);

            $studentRepo->storeStudentAddress($address_data, $student_id);

            $studentRepo->storeSiblings($siblings_data, $student_id);

            $studentRepo->storeStudentEducation($education_data, $student_id);

            $guardianRepo->store($guardians_data, $student_id);

            $answerRepo->storeAnswers($student_main_answers, $student_id);

            $answerRepo->storeSubAnswers($student_sub_answers, $student_id);
        });
    }
}
<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Student;
use App\Models\SubQuestion;
use App\Models\QuestionSelection;
use App\Models\AcademicYearAndSemester;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::findOrFail(1);

        $question1 = Question::create([
            'user_id' => $user->id,
            'question' => 'Do you have a place to study at home?',
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => false,

        ]);

        // Question 2: Share Room
        $question2 = Question::create([
            'user_id' => $user->id,
            'question' => 'Do you share your room with anyone?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => false,

        ]);

        SubQuestion::create([
            'question_id' => $question2->id,
            'sub_question' => 'Name of the person you share your room with',
            'answer_type' => 'text',
            'is_required' => true,
        ]);

        // Question 3: Person with Disability (PWD)
        $question3 = Question::create([
            'user_id' => $user->id,
            'question' => 'Person with Disabilities (PWD)?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        SubQuestion::create([
            'question_id' => $question3->id,
            'sub_question' => 'Please describe your disability',
            'answer_type' => 'text',
            'is_required' => true,
        ]);

        // Question 4: Special Education Needs
        $question4 = Question::create([
            'user_id' => $user->id,
            'question' => 'Do you have a special education need(s)?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => false,

        ]);

        SubQuestion::create([
            'question_id' => $question4->id,
            'sub_question' => 'Educational Needs Description',
            'answer_type' => 'text',
            'is_required' => true,
        ]);

        // Question 5: Mental Health Consultation
        $question5 = Question::create([
            'user_id' => $user->id,
            'question' => 'Have you consulted a psychologist or psychiatrist?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => false,

        ]);

        SubQuestion::create([
            'question_id' => $question5->id,
            'sub_question' => 'If yes, please specify the nature and diagnosis of the consultation',
            'answer_type' => 'text',
            'is_required' => true,
        ]);

        SubQuestion::create([
            'question_id' => $question5->id,
            'sub_question' => 'When was your last check-up with your Psychologist/Psychiatrist?',
            'answer_type' => 'date',
            'is_required' => true,
        ]);

        // Question 6: First-generation Student
        $question6 = Question::create([
            'user_id' => $user->id,
            'question' => 'Are you a first-generation student? (Both parents did not complete a four-year college/university degree)',
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true

        ]);

        // Question 7: Indigenous Peoples
        $question7 = Question::create([
            'user_id' => $user->id,
            'question' => 'Member of Indigenous Peoples (IP) or Indigenous Cultural Community (ICC)?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        SubQuestion::create([
            'question_id' => $question7->id,
            'sub_question' => 'If checked, please specify: ',
            'answer_type' => 'text',
            'is_required' => false,
        ]);

        $question8 = Question::create([
            'user_id' => $user->id,
            'question' => 'Indigenous cultural community',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => false,

        ]);

        // Question 8: Concerns or Problems
        $question9 = Question::create([
            'user_id' => $user->id,
            'question' => 'Do you have any problems or concerns that bother you?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => false,

        ]);

        SubQuestion::create([
            'question_id' => $question9->id,
            'sub_question' => 'Please provide the problems or concerns that bothers you',
            'answer_type' => 'text',
            'is_required' => true,
        ]);



        $question10 = Question::create([
            'user_id' => $user->id,
            'question' => 'If you have concerns, are you willing to discuss them with a guidance counselor?',
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => false,

        ]);


        $question11 = Question::create([
            'user_id' => $user->id,
            'question' => "Are you 4P's Beneficiary?",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question12 = Question::create([
            'user_id' => $user->id,
            'question' => "Homeless Individual",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);


        $question13 = Question::create([
            'user_id' => $user->id,
            'question' => "Orphan (no living parent/s)",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question14 = Question::create([
            'user_id' => $user->id,
            'question' => "Raised by a Senior Citizen/Guardian",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question15 = Question::create([
            'user_id' => $user->id,
            'question' => "Child of a Solo Parent",
            'sub_expected_answer' => 'true',
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question15_sub = SubQuestion::create([
            'question_id' => $question15->id,

            'sub_question' => 'If yes, select the following:',
            'answer_type' => 'select',
            'is_required' => true,
        ]);

        $parent = ['Mother', 'Father'];

        foreach ($parent as $item) {
            QuestionSelection::create([
                'question_id' => null,
                'sub_question_id' => $question15_sub->id,
                'item' => $item
            ]);
        }



        $question16 = Question::create([
            'user_id' => $user->id,
            'question' => "Rebel Returnee",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);


        $question17 = Question::create([
            'user_id' => $user->id,
            'question' => "Residing in and currently studying in a city/municipality wihtout access to a State University or College (SUC) or Local University or College (LUC)",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question18 = Question::create([
            'user_id' => $user->id,
            'question' => "Solo Parent Student",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question19 = Question::create([
            'user_id' => $user->id,
            'question' => "Child of rebel returnee",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question20 = Question::create([
            'user_id' => $user->id,
            'question' => "Child from families and subsistence farmers or fisherfolks",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question21 = Question::create([
            'user_id' => $user->id,
            'question' => "Residing in Geographically isolated and Disadvantaged Areas (GIDA)",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        $question22 = Question::create([
            'user_id' => $user->id,
            'question' => "Family Income is below 10,000 per month",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
            'need_proof' => true
        ]);

        // Concerns

        Question::create([
            'user_id' => $user->id,
            'question' => "If you experience personal, academic, or other concerns, would you be willing to discuss them with a guidance counselor?",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
        ]);

        Question::create([
            'user_id' => $user->id,
            'question' => "Are you currently experiencing any personal, academic, family, financial, health, or other concern(s) that you would like the Guidance Office to know about?",
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
        ]);

        $concern = Question::create([
            'user_id' => $user->id,
            'question' => "Have you consulted a Medical Doctor/Psychologist/Psychiatrist?",
            'sub_expected_answer' => 'true',
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,
        ]);

        SubQuestion::create([
            'question_id' => $concern->id,
            'sub_question' => 'If yes, what specific concerns did you consult for them for?',
            'answer_type' => 'text',
            'is_required' => true,
        ]);
    }
}

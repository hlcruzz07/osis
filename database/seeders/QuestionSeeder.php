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
        $user = User::create([
            'avatar' => null,
            'name' => "Harold Cruz",
            'email' => 'haroldlyndon.cruz@chmsu.edu.ph',
            'email_verified_at' => Carbon::now(),
            'role' => 'admin',
        ]);
        // Get or create an academic year
        $academicYear = AcademicYearAndSemester::first();
        if (!$academicYear) {
            $academicYear = AcademicYearAndSemester::create([
                'academic_year' => '2025-2026',
                'semester' => '1st Semester',
            ]);
        }

        // Question 1: Study Place at Home
        $question1 = Question::create([
            'user_id' => $user->id,
            'question' => 'Do you have a place to study at home?',
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,

        ]);

        // Question 2: Share Room
        $question2 = Question::create([
            'user_id' => $user->id,
            'question' => 'Do you share your room with anyone?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => true,

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
            'question' => 'Do you identify as a person with a disability (PWD)?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => true,

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
            'is_active' => true,

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
            'is_active' => true,

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
            'question' => 'Are you a first-generation student?',
            'answer_type' => 'boolean',
            'is_required' => false,
            'is_active' => true,

        ]);

        // Question 7: Indigenous Peoples
        $question7 = Question::create([
            'user_id' => $user->id,
            'question' => 'Indigenous Peoples',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => true,

        ]);

        SubQuestion::create([
            'question_id' => $question7->id,
            'sub_question' => 'Please specify your ethnic group',
            'answer_type' => 'text',
            'is_required' => false,
        ]);

        $question8 = Question::create([
            'user_id' => $user->id,
            'question' => 'Indigenous cultural community',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => true,

        ]);

        // Question 8: Concerns or Problems
        $question9 = Question::create([
            'user_id' => $user->id,
            'question' => 'Do you have any problems or concerns that bother you?',
            'answer_type' => 'boolean',
            'sub_expected_answer' => 'true',
            'is_required' => false,
            'is_active' => true,

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
            'is_active' => true,

        ]);
    }
}

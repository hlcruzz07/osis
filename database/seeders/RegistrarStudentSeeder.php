<?php

namespace Database\Seeders;

use App\Models\AcademicYearAndSemester;
use App\Models\Question;
use App\Repositories\AddressRepo;
use App\Repositories\AnswerRepo;
use App\Repositories\EducationRepo;
use App\Repositories\GuardianRepo;
use App\Repositories\StudentRepo;
use App\Services\ReferenceNumberService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class RegistrarStudentSeeder extends Seeder
{
    public function run(): void
    {
        /** @var StudentRepo $studentRepo */
        $studentRepo = app(StudentRepo::class);
        /** @var AddressRepo $addressRepo */
        $addressRepo = app(AddressRepo::class);
        /** @var EducationRepo $educationRepo */
        $educationRepo = app(EducationRepo::class);
        /** @var GuardianRepo $guardianRepo */
        $guardianRepo = app(GuardianRepo::class);
        /** @var AnswerRepo $answerRepo */
        $answerRepo = app(AnswerRepo::class);
        /** @var ReferenceNumberService $refService */
        $refService = app(ReferenceNumberService::class);

        $ay = AcademicYearAndSemester::latest()->first();
        $academic_year = $ay->academic_year;
        $semester = $ay->semester;

        // Load active questions keyed by their text for stable references
        $questions = Question::where('is_active', true)
            ->with('subQuestions')
            ->orderBy('id')
            ->get();

        foreach ($this->cases() as $case) {
            DB::transaction(function () use (
                $studentRepo,
                $addressRepo,
                $educationRepo,
                $guardianRepo,
                $answerRepo,
                $refService,
                $academic_year,
                $semester,
                $case,
                $questions
            ) {
                // Strip front-end-only fields that are not DB columns on students
                $studentData = array_merge(
                    Arr::except($case['student'], ['is_first_generation_student', 'is_indigenous_people', 'ethnic_group']),
                    [
                        'ref_number'    => $refService->generate(),
                        'status'        => 'Pending',
                        'academic_year' => $academic_year,
                        'semester'      => $semester,
                    ]
                );
                $student = $studentRepo->storeStudent($studentData);
                $studentId = $student->id;

                $addressRepo->storeStudentAddress($case['address'], $studentId);

                $educationRepo->store($case['educations'], $studentId);

                $guardianRepo->store($case['guardians'], $studentId);

                $answers = $this->buildAnswers($questions, $case['answers'] ?? []);

                $mainAnswers = collect($answers)
                    ->filter(fn($a) => is_null($a['sub_question_id']))
                    ->values()
                    ->toArray();

                $subAnswers = collect($answers)
                    ->filter(fn($a) => !is_null($a['sub_question_id']) && !is_null($a['answer']))
                    ->values()
                    ->toArray();

                $answerRepo->storeAnswers($mainAnswers, $studentId);

                if (!empty($subAnswers)) {
                    $answerRepo->storeSubAnswers($subAnswers, $studentId);
                }
            });
        }
    }

    // -------------------------------------------------------------------------
    // Builds the answers array from the active questions + per-case overrides.
    // $overrides: ['Question text' => answer_value]  (sub-questions not needed)
    // -------------------------------------------------------------------------
    private function buildAnswers(\Illuminate\Database\Eloquent\Collection $questions, array $overrides): array
    {
        $answers = [];

        foreach ($questions as $question) {
            $answer = $overrides[$question->question] ?? false; // default boolean false

            $answers[] = [
                'question_id'     => $question->id,
                'sub_question_id' => null,
                'answer_type'     => $question->answer_type,
                'answer'          => $answer,
            ];

            // If the answer matches sub_expected_answer and there are sub-questions,
            // add them with null answers (they will be filtered out as empty).
            if ($question->subQuestions->isNotEmpty()) {
                $shouldShow = $question->sub_expected_answer !== null
                    ? strtolower((string) $answer) === strtolower((string) $question->sub_expected_answer)
                    : true;

                if ($shouldShow) {
                    foreach ($question->subQuestions as $sub) {
                        $subAnswer = $overrides["sub:{$sub->id}"] ?? null;
                        $answers[] = [
                            'question_id'     => $question->id,
                            'sub_question_id' => $sub->id,
                            'answer_type'     => $sub->answer_type,
                            'answer'          => $subAnswer,
                        ];
                    }
                }
            }
        }

        return $answers;
    }

    // -------------------------------------------------------------------------
    // Test cases covering the different paths in the Registrar form
    // -------------------------------------------------------------------------
    private function cases(): array
    {
        return [
            // ── Case 1 ───────────────────────────────────────────────────────
            // Continuing student, BSIT (no major), only required edu levels,
            // Mother (living) + Father (living, contact person).
            // ─────────────────────────────────────────────────────────────────
            [
                'student' => [
                    'lrn'                          => null,
                    'fname'                        => 'Maria',
                    'mname'                        => 'Santos',
                    'lname'                        => 'Reyes',
                    'suffix'                       => null,
                    'birthdate'                    => '2004-03-15',
                    'birthplace'                   => 'Bacolod City',
                    'civil_status'                 => 'Single',
                    'gender'                => 'Female',
                    'email'                        => 'maria.reyes.bsit@gmail.com',
                    'mobile_num'                   => '9123456789',
                    'date_admitted'                => '2024-08-01',
                    'campus'                       => 'Talisay',
                    'year_level'                   => 'First Year',
                    'course'                       => 'Bachelor of Science in Information Technology',
                    'major'                        => null,
                    'student_type'                 => 'Continuing',
                    'is_first_generation_student'  => false,
                    'is_indigenous_people'         => false,
                    'ethnic_group'                 => null,
                ],
                'address' => [
                    'island'    => 'Visayas',
                    'region'    => 'Region VI - Western Visayas',
                    'province'  => 'Negros Occidental',
                    'city'      => 'Talisay',
                    'brgy'      => 'Zone 1',
                    'zip_code'  => '6115',
                ],
                'educations' => [
                    [
                        'education_level'        => 'Elementary',
                        'school_name'            => 'Talisay Central Elementary School',
                        'school_address'         => 'Zone 1, Talisay, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2016',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Junior High School',
                        'school_name'            => 'Talisay National High School',
                        'school_address'         => 'Zone 3, Talisay, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2020',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Senior High School',
                        'school_name'            => 'Talisay National High School',
                        'school_address'         => 'Zone 3, Talisay, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2022',
                        'strand'                 => 'STEM',
                    ],
                ],
                'guardians' => [
                    [
                        'role'                      => 'Mother',
                        'fname'                     => 'Lourdes',
                        'mname'                     => 'Cruz',
                        'lname'                     => 'Reyes',
                        'suffix'                    => null,
                        'birthdate'                 => '1975-07-20',
                        'birthplace'                => 'Bacolod City',
                        'mobile_num'                => null,
                        'religion'                  => 'Roman Catholic',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'High School Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Market Vendor',
                        'is_contact_person'         => false,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Talisay',
                            'brgy'     => 'Zone 1',
                            'zip_code' => '6115',
                        ],
                    ],
                    [
                        'role'                      => 'Father',
                        'fname'                     => 'Roberto',
                        'mname'                     => 'Dela',
                        'lname'                     => 'Reyes',
                        'suffix'                    => 'Sr',
                        'birthdate'                 => '1970-11-05',
                        'birthplace'                => 'Talisay, Negros Occidental',
                        'mobile_num'                => '9187654321',
                        'religion'                  => 'Roman Catholic',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'High School Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Tricycle Driver',
                        'is_contact_person'         => true,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Talisay',
                            'brgy'     => 'Zone 1',
                            'zip_code' => '6115',
                        ],
                    ],
                ],
                'answers' => [
                    'Do you have a place to study at home?'                                                                                  => true,
                    'Do you share your room with anyone?'                                                                                    => false,
                    'Do you identify as a person with a disability (PWD)?'                                                                   => false,
                    'Do you have a special education need(s)?'                                                                               => false,
                    'Have you consulted a psychologist or psychiatrist?'                                                                     => false,
                    'Are you a first-generation student? (Both parents did not complete a four-year college/university degree)'              => false,
                    'Are a member of any Indigenous People (IP) or Indigenous Cultural Community (ICC)?'                                    => false,
                    'Indigenous cultural community'                                                                                         => false,
                    'Do you have any problems or concerns that bother you?'                                                                  => false,
                    'If you have concerns, are you willing to discuss them with a guidance counselor?'                                       => false,
                ],
            ],

            // ── Case 2 ───────────────────────────────────────────────────────
            // Student with major (BSEd - Mathematics), with LRN,
            // all edu levels (including College as Transferee),
            // Father deceased, additional Aunt guardian, first-gen student.
            // ─────────────────────────────────────────────────────────────────
            [
                'student' => [
                    'lrn'                          => '1234567890',
                    'fname'                        => 'Juan',
                    'mname'                        => null,
                    'lname'                        => 'Dela Cruz',
                    'suffix'                       => 'Jr',
                    'birthdate'                    => '2001-09-22',
                    'birthplace'                   => 'Silay City',
                    'civil_status'                 => 'Single',
                    'gender'                => 'Male',
                    'email'                        => 'juan.delacruz.bsed@gmail.com',
                    'mobile_num'                   => '9201112233',
                    'date_admitted'                => '2024-08-01',
                    'campus'                       => 'Alijis',
                    'year_level'                   => 'Third Year',
                    'course'                       => 'Bachelor of Secondary Education',
                    'major'                        => 'Mathematics',
                    'student_type'                 => 'Transferee',
                    'is_first_generation_student'  => true,
                    'is_indigenous_people'         => false,
                    'ethnic_group'                 => null,
                ],
                'address' => [
                    'island'    => 'Visayas',
                    'region'    => 'Region VI - Western Visayas',
                    'province'  => 'Negros Occidental',
                    'city'      => 'Silay',
                    'brgy'      => 'Zone 5',
                    'zip_code'  => '6116',
                ],
                'educations' => [
                    [
                        'education_level'        => 'Elementary',
                        'school_name'            => 'Silay Central Elementary School',
                        'school_address'         => 'Rizal St, Silay City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2013',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Junior High School',
                        'school_name'            => 'Silay City National High School',
                        'school_address'         => 'Burgos St, Silay City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2017',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Senior High School',
                        'school_name'            => 'Silay City National High School - SHS',
                        'school_address'         => 'Burgos St, Silay City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2019',
                        'strand'                 => 'HUMSS',
                    ],
                    [
                        'education_level'        => 'College',
                        'school_name'            => 'West Negros University',
                        'school_address'         => 'Burgos St, Bacolod City, Negros Occidental',
                        'school_type'            => 'Private',
                        'year_graduated'         => '2021',
                        'strand'                 => null,
                    ],
                ],
                'guardians' => [
                    [
                        'role'                      => 'Mother',
                        'fname'                     => 'Rosario',
                        'mname'                     => 'Gomez',
                        'lname'                     => 'Dela Cruz',
                        'suffix'                    => null,
                        'birthdate'                 => '1972-04-10',
                        'birthplace'                => 'Silay City',
                        'mobile_num'                => '9301234567',
                        'religion'                  => 'Roman Catholic',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'Elementary Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Housewife',
                        'is_contact_person'         => true,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Silay',
                            'brgy'     => 'Zone 5',
                            'zip_code' => '6116',
                        ],
                    ],
                    [
                        'role'                      => 'Father',
                        'fname'                     => 'Ernesto',
                        'mname'                     => null,
                        'lname'                     => 'Dela Cruz',
                        'suffix'                    => 'Jr',
                        'birthdate'                 => '1968-12-01',
                        'birthplace'                => 'Silay City',
                        'mobile_num'                => null,
                        'religion'                  => 'Roman Catholic',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'No Formal Education',
                        'life_status'               => 'Deceased',
                        'occupation'                => null,
                        'is_contact_person'         => false,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Silay',
                            'brgy'     => 'Zone 5',
                            'zip_code' => '6116',
                        ],
                    ],
                    [
                        'role'                      => 'Aunt',
                        'fname'                     => 'Carmelita',
                        'mname'                     => 'Gomez',
                        'lname'                     => 'Soriano',
                        'suffix'                    => null,
                        'birthdate'                 => '1969-06-18',
                        'birthplace'                => 'Bacolod City',
                        'mobile_num'                => '9489876543',
                        'religion'                  => 'Iglesia Ni Cristo',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'College Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Teacher',
                        'is_contact_person'         => false,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Bacolod',
                            'brgy'     => 'Mandalagan',
                            'zip_code' => '6100',
                        ],
                    ],
                ],
                'answers' => [
                    'Do you have a place to study at home?'                                                                                  => true,
                    'Do you share your room with anyone?'                                                                                    => true,
                    'Do you identify as a person with a disability (PWD)?'                                                                   => false,
                    'Do you have a special education need(s)?'                                                                               => false,
                    'Have you consulted a psychologist or psychiatrist?'                                                                     => false,
                    'Are you a first-generation student? (Both parents did not complete a four-year college/university degree)'              => true,
                    'Are a member of any Indigenous People (IP) or Indigenous Cultural Community (ICC)?'                                    => false,
                    'Indigenous cultural community'                                                                                         => false,
                    'Do you have any problems or concerns that bother you?'                                                                  => false,
                    'If you have concerns, are you willing to discuss them with a guidance counselor?'                                       => false,
                ],
            ],

            // ── Case 3 ───────────────────────────────────────────────────────
            // IP member with ethnic group, BSBA (Financial Management major),
            // Shiftee, has study/mental health concerns, PWD sub-answer filled.
            // ─────────────────────────────────────────────────────────────────
            [
                'student' => [
                    'lrn'                          => '9876543210',
                    'fname'                        => 'Anjanette',
                    'mname'                        => 'Bilog',
                    'lname'                        => 'Maraon',
                    'suffix'                       => null,
                    'birthdate'                    => '2003-01-30',
                    'birthplace'                   => 'Kabankalan City',
                    'civil_status'                 => 'Single',
                    'gender'                       => 'Female',
                    'email'                        => 'anjanette.maraon.bsba@gmail.com',
                    'mobile_num'                   => null,
                    'date_admitted'                => '2024-08-01',
                    'campus'                       => 'Binalbagan',
                    'year_level'                   => 'Second Year',
                    'course'                       => 'Bachelor of Science in Business Administration',
                    'major'                        => 'Financial Management',
                    'student_type'                 => 'Shiftee',
                    'is_first_generation_student'  => true,
                    'is_indigenous_people'         => true,
                    'ethnic_group'                 => 'Ati',
                ],
                'address' => [
                    'island'    => 'Visayas',
                    'region'    => 'Region VI - Western Visayas',
                    'province'  => 'Negros Occidental',
                    'city'      => 'Kabankalan',
                    'brgy'      => 'Zone 8',
                    'zip_code'  => '6111',
                ],
                'educations' => [
                    [
                        'education_level'        => 'Elementary',
                        'school_name'            => 'Kabankalan Central School',
                        'school_address'         => 'Rizal Ave, Kabankalan City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2015',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Junior High School',
                        'school_name'            => 'Kabankalan National High School',
                        'school_address'         => 'Magsaysay St, Kabankalan City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2019',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Senior High School',
                        'school_name'            => 'Kabankalan National High School - SHS',
                        'school_address'         => 'Magsaysay St, Kabankalan City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2021',
                        'strand'                 => 'ABM',
                    ],
                ],
                'guardians' => [
                    [
                        'role'                      => 'Mother',
                        'fname'                     => 'Natividad',
                        'mname'                     => null,
                        'lname'                     => 'Maraon',
                        'suffix'                    => null,
                        'birthdate'                 => '1978-09-12',
                        'birthplace'                => 'Kabankalan City',
                        'mobile_num'                => '9551234567',
                        'religion'                  => 'Lumad Spirituality',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'Elementary Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Farmer',
                        'is_contact_person'         => true,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Kabankalan',
                            'brgy'     => 'Zone 8',
                            'zip_code' => '6111',
                        ],
                    ],
                    [
                        'role'                      => 'Father',
                        'fname'                     => 'Teodoro',
                        'mname'                     => 'Bilog',
                        'lname'                     => 'Maraon',
                        'suffix'                    => null,
                        'birthdate'                 => '1975-03-27',
                        'birthplace'                => 'Kabankalan City',
                        'mobile_num'                => null,
                        'religion'                  => 'Lumad Spirituality',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'No Formal Education',
                        'life_status'               => 'Living',
                        'occupation'                => 'Farmer',
                        'is_contact_person'         => false,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Kabankalan',
                            'brgy'     => 'Zone 8',
                            'zip_code' => '6111',
                        ],
                    ],
                ],
                'answers' => [
                    'Do you have a place to study at home?'                                                                                  => false,
                    'Do you share your room with anyone?'                                                                                    => true,
                    'Do you identify as a person with a disability (PWD)?'                                                                   => false,
                    'Do you have a special education need(s)?'                                                                               => false,
                    'Have you consulted a psychologist or psychiatrist?'                                                                     => false,
                    'Are you a first-generation student? (Both parents did not complete a four-year college/university degree)'              => true,
                    'Are a member of any Indigenous People (IP) or Indigenous Cultural Community (ICC)?'                                    => true,
                    'Indigenous cultural community'                                                                                         => true,
                    'Do you have any problems or concerns that bother you?'                                                                  => true,
                    'If you have concerns, are you willing to discuss them with a guidance counselor?'                                       => true,
                ],
            ],

            // ── Case 4 ───────────────────────────────────────────────────────
            // Fresh Graduate, BEEd (General Education major), Fortune Towne campus,
            // all questions false, Grad School education level included,
            // Mother and Father both living, custom sex orientation ("Others" path).
            // ─────────────────────────────────────────────────────────────────
            [
                'student' => [
                    'lrn'                          => null,
                    'fname'                        => 'Patrick',
                    'mname'                        => 'Villanueva',
                    'lname'                        => 'Ocon',
                    'suffix'                       => null,
                    'birthdate'                    => '1998-06-14',
                    'birthplace'                   => 'Bacolod City',
                    'civil_status'                 => 'Married',
                    'gender'                        => 'Male',
                    'email'                        => 'patrick.ocon.beed@gmail.com',
                    'mobile_num'                   => '9670001234',
                    'date_admitted'                => '2024-08-01',
                    'campus'                       => 'Fortune Towne',
                    'year_level'                   => 'Fourth Year',
                    'course'                       => 'Bachelor of Elementary Education',
                    'major'                        => 'General Education',
                    'student_type'                 => 'Fresh Graduate',
                    'is_first_generation_student'  => false,
                    'is_indigenous_people'         => false,
                    'ethnic_group'                 => null,
                ],
                'address' => [
                    'island'    => 'Visayas',
                    'region'    => 'Region VI - Western Visayas',
                    'province'  => 'Negros Occidental',
                    'city'      => 'Bacolod',
                    'brgy'      => 'Mandalagan',
                    'zip_code'  => '6100',
                ],
                'educations' => [
                    [
                        'education_level'        => 'Elementary',
                        'school_name'            => 'Bacolod City Central School',
                        'school_address'         => 'Lacson St, Bacolod City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2010',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Junior High School',
                        'school_name'            => 'Bacolod City National High School',
                        'school_address'         => 'Lacson St, Bacolod City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2014',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Senior High School',
                        'school_name'            => 'Bacolod City National High School - SHS',
                        'school_address'         => 'Lacson St, Bacolod City, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2016',
                        'strand'                 => 'GAS',
                    ],
                    [
                        'education_level'        => 'College',
                        'school_name'            => 'Carlos Hilado Memorial State University',
                        'school_address'         => 'Talisay, Negros Occidental',
                        'school_type'            => 'Public',
                        'year_graduated'         => '2020',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Grad School',
                        'school_name'            => 'University of St. La Salle',
                        'school_address'         => 'La Salle Ave, Bacolod City, Negros Occidental',
                        'school_type'            => 'Private',
                        'year_graduated'         => '2023',
                        'strand'                 => null,
                    ],
                ],
                'guardians' => [
                    [
                        'role'                      => 'Mother',
                        'fname'                     => 'Felicidad',
                        'mname'                     => 'Villanueva',
                        'lname'                     => 'Ocon',
                        'suffix'                    => null,
                        'birthdate'                 => '1965-02-28',
                        'birthplace'                => 'Bacolod City',
                        'mobile_num'                => '9772223344',
                        'religion'                  => 'Roman Catholic',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'College Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Government Employee',
                        'is_contact_person'         => true,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Bacolod',
                            'brgy'     => 'Mandalagan',
                            'zip_code' => '6100',
                        ],
                    ],
                    [
                        'role'                      => 'Father',
                        'fname'                     => 'Gregorio',
                        'mname'                     => null,
                        'lname'                     => 'Ocon',
                        'suffix'                    => null,
                        'birthdate'                 => '1962-08-09',
                        'birthplace'                => 'Bacolod City',
                        'mobile_num'                => null,
                        'religion'                  => 'Roman Catholic',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'College Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Engineer',
                        'is_contact_person'         => false,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Bacolod',
                            'brgy'     => 'Mandalagan',
                            'zip_code' => '6100',
                        ],
                    ],
                ],
                'answers' => [
                    'Do you have a place to study at home?'                                                                                  => true,
                    'Do you share your room with anyone?'                                                                                    => false,
                    'Do you identify as a person with a disability (PWD)?'                                                                   => false,
                    'Do you have a special education need(s)?'                                                                               => false,
                    'Have you consulted a psychologist or psychiatrist?'                                                                     => false,
                    'Are you a first-generation student? (Both parents did not complete a four-year college/university degree)'              => false,
                    'Are a member of any Indigenous People (IP) or Indigenous Cultural Community (ICC)?'                                    => false,
                    'Indigenous cultural community'                                                                                         => false,
                    'Do you have any problems or concerns that bother you?'                                                                  => false,
                    'If you have concerns, are you willing to discuss them with a guidance counselor?'                                       => false,
                ],
            ],

            // ── Case 5 ───────────────────────────────────────────────────────
            // Returnee student, BS Psychology (no major), PWD with disability
            // description, has psychological consultation history.
            // ─────────────────────────────────────────────────────────────────
            [
                'student' => [
                    'lrn'                          => null,
                    'fname'                        => 'Clarisse',
                    'mname'                        => 'Fuentes',
                    'lname'                        => 'Estrada',
                    'suffix'                       => null,
                    'birthdate'                    => '2002-11-07',
                    'birthplace'                   => 'Bacolod City',
                    'civil_status'                 => 'Single',
                    'gender'                => 'Male',
                    'email'                        => 'clarisse.estrada.bspsy@gmail.com',
                    'mobile_num'                   => '9339998877',
                    'date_admitted'                => '2024-08-01',
                    'campus'                       => 'Talisay',
                    'year_level'                   => 'Second Year',
                    'course'                       => 'Bachelor of Science in Psychology',
                    'major'                        => null,
                    'student_type'                 => 'Returnee',
                    'is_first_generation_student'  => false,
                    'is_indigenous_people'         => false,
                    'ethnic_group'                 => null,
                ],
                'address' => [
                    'island'    => 'Visayas',
                    'region'    => 'Region VI - Western Visayas',
                    'province'  => 'Negros Occidental',
                    'city'      => 'Bacolod',
                    'brgy'      => 'Bata',
                    'zip_code'  => '6100',
                ],
                'educations' => [
                    [
                        'education_level'        => 'Elementary',
                        'school_name'            => 'Our Lady Of Mercy School',
                        'school_address'         => 'Rizal St, Bacolod City, Negros Occidental',
                        'school_type'            => 'Private',
                        'year_graduated'         => '2014',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Junior High School',
                        'school_name'            => 'La Salle Academy Bacolod',
                        'school_address'         => 'La Salle Ave, Bacolod City, Negros Occidental',
                        'school_type'            => 'Private',
                        'year_graduated'         => '2018',
                        'strand'                 => null,
                    ],
                    [
                        'education_level'        => 'Senior High School',
                        'school_name'            => 'La Salle Academy Bacolod - SHS',
                        'school_address'         => 'La Salle Ave, Bacolod City, Negros Occidental',
                        'school_type'            => 'Private',
                        'year_graduated'         => '2020',
                        'strand'                 => 'STEM',
                    ],
                ],
                'guardians' => [
                    [
                        'role'                      => 'Mother',
                        'fname'                     => 'Miriam',
                        'mname'                     => 'Fuentes',
                        'lname'                     => 'Estrada',
                        'suffix'                    => null,
                        'birthdate'                 => '1976-05-30',
                        'birthplace'                => 'Bacolod City',
                        'mobile_num'                => '9450001111',
                        'religion'                  => 'Roman Catholic',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'College Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Nurse',
                        'is_contact_person'         => true,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Bacolod',
                            'brgy'     => 'Bata',
                            'zip_code' => '6100',
                        ],
                    ],
                    [
                        'role'                      => 'Father',
                        'fname'                     => 'Eduardo',
                        'mname'                     => null,
                        'lname'                     => 'Estrada',
                        'suffix'                    => null,
                        'birthdate'                 => '1973-10-15',
                        'birthplace'                => 'Bacolod City',
                        'mobile_num'                => null,
                        'religion'                  => 'Baptist',
                        'citizenship'               => 'Filipino',
                        'highest_educ_attainment'   => 'Post Graduate',
                        'life_status'               => 'Living',
                        'occupation'                => 'Doctor',
                        'is_contact_person'         => false,
                        'address' => [
                            'island'   => 'Visayas',
                            'region'   => 'Region VI - Western Visayas',
                            'province' => 'Negros Occidental',
                            'city'     => 'Bacolod',
                            'brgy'     => 'Bata',
                            'zip_code' => '6100',
                        ],
                    ],
                ],
                'answers' => [
                    'Do you have a place to study at home?'                                                                                  => true,
                    'Do you share your room with anyone?'                                                                                    => false,
                    'Do you identify as a person with a disability (PWD)?'                                                                   => true,
                    'Do you have a special education need(s)?'                                                                               => true,
                    'Have you consulted a psychologist or psychiatrist?'                                                                     => true,
                    'Are you a first-generation student? (Both parents did not complete a four-year college/university degree)'              => false,
                    'Are a member of any Indigenous People (IP) or Indigenous Cultural Community (ICC)?'                                    => false,
                    'Indigenous cultural community'                                                                                         => false,
                    'Do you have any problems or concerns that bother you?'                                                                  => true,
                    'If you have concerns, are you willing to discuss them with a guidance counselor?'                                       => true,
                ],
            ],
        ];
    }
}

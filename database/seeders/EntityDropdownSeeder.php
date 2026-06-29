<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\EntityDropdown;

class EntityDropdownSeeder extends Seeder
{
    public function run(): void
    {
        $dropdowns = [
            'Student Status' => [
                'Pending',
                'Declined',
                'Accepted'
            ],
            'Year Levels' => [
                'First Year',
                'Second Year',
                'Third Year',
                'Fourth Year',
                'Fifth Year',
                'Sixth Year',
            ],

            'Campuses' => [
                'Talisay',
                'Alijis',
                'Fortune Towne',
                'Binalbagan',
            ],

            'Courses' => [
                [
                    'name' => 'Bachelor of Arts in English Language',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Arts in Social Science',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Psychology',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Public Administration',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Applied Mathematics',
                    'majors' => [],
                ],

                [
                    'name' => 'Bachelor of Elementary Education',
                    'majors' => ['General Education'],
                ],
                [
                    'name' => 'Bachelor of Early Childhood Education',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Physical Education',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Secondary Education',
                    'majors' => [
                        'English',
                        'Filipino',
                        'Mathematics',
                        'Science',
                    ],
                ],
                [
                    'name' => 'Bachelor of Special Needs Education',
                    'majors' => ['Generalist'],
                ],
                [
                    'name' => 'Bachelor of Technology and Livelihood Education',
                    'majors' => [
                        'Home Economics',
                        'Industrial',
                    ],
                ],

                [
                    'name' => 'Bachelor of Industrial Technology',
                    'majors' => [
                        'Apparel & Fashion Technology',
                        'Architectural Drafting Technology',
                        'Automotive Technology',
                        'Culinary Technology',
                        'Electrical Technology',
                        'Electronics Technology',
                        'HVACR Technology',
                        'Mechanical Technology',
                    ],
                ],
                [
                    'name' => 'Bachelor of Science in Industrial Technology',
                    'majors' => [
                        'Apparel & Fashion Technology',
                        'Architectural Drafting Technology',
                        'Automotive Technology',
                        'Culinary Technology',
                        'Electrical Technology',
                        'Electronics Technology',
                        'HVACR Technology',
                        'Mechanical Technology',
                    ],
                ],

                [
                    'name' => 'Bachelor of Science in Hospitality Management',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Information Systems',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Information Technology',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Civil Engineering',
                    'majors' => [],
                ],

                [
                    'name' => 'Bachelor of Science in Business Administration',
                    'majors' => ['Financial Management'],
                ],

                [
                    'name' => 'Bachelor of Science in Criminology',
                    'majors' => [],
                ],

                [
                    'name' => 'Bachelor of Science in Accountancy',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Entrepreneurship',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Management Accounting',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Office Administration',
                    'majors' => [],
                ],

                [
                    'name' => 'Bachelor of Science in Computer Engineering',
                    'majors' => [],
                ],
                [
                    'name' => 'Bachelor of Science in Electronics Engineering',
                    'majors' => [],
                ],
            ],

            'Student Type' => [
                'Shiftee',
                'Returnee',
                'Continuing',
                'Transferee',
                'Fresh Graduate',
            ],

            'Equity Indicator' => [
                'First Generation College Student',
                'Four Ps Beneficiary',
                'Solo Parent',
                'Raised By A Single Or Solo Parent',
                'Orphan',
                'Person With Disability',
                'Living In A Geographically Isolated And Disadvantaged Area',
                'Member Of Indigenous People',
                'Belongs To A Family Of Subsistence Farmers Or Fisher Folks',
                'Belongs To A Family Of Rebel Returnees',
                'Not Applicable',
            ],

            'Suffix' => [
                'Jr',
                'Sr',
                'II',
                'III',
                'IV',
                'V',
                'None',
            ],

            'Financer' => [
                'None',
                'Parents',
                'Spouse',
                'Siblings',
                'Relative',
                'Scholarship',
                'Self Supporting',
                'Others',
            ],

            'Religion' => [
                'Roman Catholic',
                'Baptist',
                'Methodist',
                'Pentecostal',
                'Evangelical',
                'Seventh-day Adventist',
                'Lutheran',
                'Presbyterian',
                'United Church Of Christ In the Philippines (UCCP)',
                'Iglesia Ni Cristo',
                'Sunni Islam',
                'Shia Islam',
                'Aglipayan Church (Philippine Independent Church)',
                "Jehovah's Witnesses",
                'Church Of Jesus Christ Of Latter-day Saints (Mormons)',
                'Judaism',
                'Mahayana Buddhism',
                'Theravada Buddhism',
                'Vaishnavism (Hinduism)',
                'Shaivism (Hinduism)',
                'Lumad Spirituality',
                'Cordillera Indigenous Religions',
                'Anito / Ancestor Worship',
                'Shamanistic Practices',
                'Agnostic',
                'Atheist',
                'Humanist',
                'Secular',
            ],

            'Civil Status' => [
                'None',
                'Single',
                'Married',
                'Widow',
                'Divorced',
            ],

            'Sexual Orientation' => [
                'Male',
                'Female',
                'Heterosexual',
                'Lesbian',
                'Gay',
                'Bisexual',
                'Transgender',
                'Prefer Not To Say',
                'Others',
            ],

            'Educational Attainment' => [
                'No Formal Education',
                'Elementary Graduate',
                'High School Graduate',
                'Vocational',
                'College Level',
                'College Graduate',
                'Post Graduate',
            ],

            'Life Status' => [
                'Living',
                'Deceased',
            ],

            'School Type' => [
                'Public',
                'Private',
            ],

            'Household Monthly Income' => [
                'Less than Php 10,957',
                'Php 10,958 - Php 21,193',
                'Php 21,194 - Php 43,823',
                'Php 43,824 - Php 76,668',
                'Php 76,669 - Php 131,483',
                'Php 131,484 - Php 219,319',
                'Php 219,140 and above',
            ],

            'Parents Martial Status' => [
                'None',
                'Married And Living Together',
                'Single Parent',
                'Annulled',
                'Married But Separated',
                'Not Married But Living Together',
                'Others',
            ],

            'Nature Of Residence' => [
                'Family Home',
                'Boarding House',
                'Rented Room',
                'Relatives House',
                'Rented Apartment',
                'Dorm',
                'House of Married Sibling',
                'Others',
            ],

            'Family Role' => [
                'Father',
                'Mother',
                'Grand Father',
                'Grand Mother',
                'Sibling',
                'Spouse',
                'Cousin',
                'Uncle',
                'Aunt',
                'Friend',
            ],


        ];

        foreach ($dropdowns as $title => $values) {
            EntityDropdown::create([
                'title' => $title,
                'dropdowns' => $values
            ]);
        }
    }
}

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
                    'name' => 'Ba In English Language',
                    'majors' => [],
                ],
                [
                    'name' => 'Ba Social Science',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs Psychology',
                    'majors' => [],
                ],
                [
                    'name' => 'B Of Public Administration',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Applied Mathematics',
                    'majors' => [],
                ],

                [
                    'name' => 'B Of Elementary Education',
                    'majors' => ['General Education'],
                ],
                [
                    'name' => 'B Of Early Childhood Educ',
                    'majors' => [],
                ],
                [
                    'name' => 'B Of Physical Education',
                    'majors' => [],
                ],
                [
                    'name' => 'B Of Secondary Education',
                    'majors' => [
                        'English',
                        'Filipino',
                        'Mathematics',
                        'Science',
                    ],
                ],
                [
                    'name' => 'B Of Special Needs Education',
                    'majors' => ['Generalist'],
                ],
                [
                    'name' => 'B Of Technology & Livelihood Education',
                    'majors' => [
                        'Home Economics',
                        'Industrial',
                    ],
                ],

                [
                    'name' => 'B Of Industrial Technology',
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
                    'name' => 'Bs In Industrial Technology',
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
                    'name' => 'Bs In Hospitality Management',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Information Systems',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Information Technology',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Civil Engineering',
                    'majors' => [],
                ],

                [
                    'name' => 'Bs In Business Administration',
                    'majors' => ['Financial Management'],
                ],

                [
                    'name' => 'Bs In Criminology',
                    'majors' => [],
                ],

                [
                    'name' => 'Bs In Accountancy',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Entrepreneurship',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Management Accounting',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Office Administration',
                    'majors' => [],
                ],

                [
                    'name' => 'Bs In Computer Engineering',
                    'majors' => [],
                ],
                [
                    'name' => 'Bs In Electronics Engineering',
                    'majors' => [],
                ],
            ],

            'Student Type' => [
                'Shiftee',
                'Returnee',
                'Continuing',
                'Transferee',
                'Freshmen',
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
                'Parents',
                'Spouse',
                'Sibling(s)',
                'Relative',
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
                'Single',
                'Married',
                'Widow/Widower',
            ],

            'Sexual Orientation' => [
                'Heterosexual/Straight',
                'Lesbian',
                'Gay',
                'Bisexual',
                'Transgender',
                'Rather not say',
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
                [
                    'monthly' => 'Less than Php 13,873 - 36,400',
                    'annual' => 'Php 166,476 - 436,800'
                ],
                [
                    'monthly' => 'Php 36,401 - 63,700',
                    'annual' => 'Php 436,812 - 764,400'
                ],
                [
                    'monthly' => 'Php 63,701 - 109,200',
                    'annual' => 'Php 764,412 - 1,310,400'
                ],
                [
                    'monthly' => 'Php 109,201 - 182,000',
                    'annual' => 'Php 1,310,412 - 2,184,000'
                ],
                [
                    'monthly' => 'Above Php 182,001',
                    'annual' => 'Above Php 2,184,012'
                ],
            ],

            'Parents Martial Status' => [
                'Married And Living Together',
                'Single Parent',
                'Annulled',
                'Married But Separated',
                'Not Married But Living Together',
                'Others',
            ],

            'Nature Of Residence' => [
                'Family Home',
                'Rented Apartment',
                'Boarding House',
                'Dorm',
                "Relative's House",
                'Rented Room',
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

            'Scholarships' => [
                [
                    'name' => 'CHED Merit Scholarship Program (CMSP)',
                    'type' => ['Full', 'Half'],
                ],
                [
                    'name' => 'Tertiary Education Subsidy (TES)',
                    'type' => [],
                ],
                [
                    'name' => 'Tulong-Dunong Program (TDP)',
                    'type' => [],
                ],
                [
                    'name' => 'NOSP',
                    'type' => [],
                ],
                [
                    'name' => 'SGS',
                    'type' => [],
                ],
                [
                    'name' => 'DOST',
                    'type' => [],
                ],
                [
                    'name' => 'LGU',
                    'type' => [],
                ],
                [
                    'name' => 'Others',
                    'type' => [],
                ],
            ]
        ];

        foreach ($dropdowns as $title => $values) {
            EntityDropdown::create([
                'title' => $title,
                'dropdowns' => $values
            ]);
        }
    }
}

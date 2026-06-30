<?php

namespace App\Exports;

use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StudentsCollectionExport implements WithMultipleSheets
{
    public function __construct(private readonly Collection $students) {}

    public function sheets(): array
    {
        return [
            new StudentsTableSheet($this->students),
            new GuardiansTableSheet($this->students),
            new EducationTableSheet($this->students),
            new SiblingsTableSheet($this->students),
            new FamilyInfoTableSheet($this->students),
        ];
    }
}

/**
 * Shared header styling so every sheet looks consistent
 */
trait StyledSheet
{
    protected function headerAndBorderStyles(int $dataRows, string $lastCol): array
    {
        $lastRow = $dataRows + 1;

        return [
            1 => [
                'font' => [
                    'bold'  => true,
                    'color' => ['rgb' => 'FFFFFF'],
                    'size'  => 11,
                ],
                'fill' => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '1A6B5C'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical'   => Alignment::VERTICAL_CENTER,
                    'wrapText'   => true,
                ],
            ],
            "A1:{$lastCol}{$lastRow}" => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color'       => ['rgb' => 'CCCCCC'],
                    ],
                ],
            ],
        ];
    }
}

/**
 * Main student info sheet
 */
class StudentsTableSheet implements FromArray, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{
    use StyledSheet;

    public function __construct(private readonly Collection $students) {}

    public function title(): string
    {
        return 'Students';
    }

    public function headings(): array
    {
        return [
            'Reference #',
            'LRN',
            'Academic Year',
            'Semester',
            'Campus',
            'Date Admitted',
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Gender',
            'Status',
            'Year Level',
            'Course',
            'Major',
            'Student Type',
            'Equity Indicator',
            'Birthdate',
            'Birthplace',
            'Citizenship',
            'Civil Status',
            'Sexual Orientation',
            'Height',
            'Weight',
            'Weekly Allowance',
            'Financer',
            'Last Attended School',
            'Email',
            'Mobile',
            'Scholarship Program',
            'Scholarship Address',
            'Scholarship Contact',
            'Address (Brgy)',
            'City',
            'Province',
            'Region',
            'Island',
            'Zip Code',
        ];
    }

    public function array(): array
    {
        return $this->students->map(function ($student) {
            $addr = $student->address;

            return [
                $student->ref_number ?? $student->id,
                $student->lrn ?? '',
                $student->academic_year ?? '',
                $student->semester ?? '',
                $student->campus ?? '',
                $student->date_admitted ?? '',
                $student->fname,
                $student->mname,
                $student->lname,
                $student->suffix ?? '',
                $student->gender ?? '',
                $student->status ?? '',
                $student->year_level ?? '',
                $student->course ?? '',
                $student->major ?? '',
                $student->student_type ?? '',
                $student->equity_indicator ?? '',
                $student->birthdate ?? '',
                $student->birthplace ?? '',
                $student->citizenship ?? '',
                $student->civil_status ?? '',
                $student->sexual_orient ?? '',
                $student->height ?? '',
                $student->weight ?? '',
                $student->weekly_allowance ?? '',
                $student->financer ?? '',
                $student->last_attended_school ?? '',
                $student->email ?? '',
                $student->mobile_num ?? '',
                $student->scholarship_program ?? '',
                $student->scholarship_address ?? '',
                $student->scholarship_contact ?? '',
                $addr?->brgy ?? '',
                $addr?->city ?? '',
                $addr?->province ?? '',
                $addr?->region ?? '',
                $addr?->island ?? '',
                $addr?->zip_code ?? '',
            ];
        })->toArray();
    }

    public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        return $this->headerAndBorderStyles(count($this->students), 'AK');
    }
}

/**
 * Guardians sheet — one row per guardian, linked back to student
 */
class GuardiansTableSheet implements FromArray, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{
    use StyledSheet;

    private array $rows = [];

    public function __construct(private readonly Collection $students)
    {
        foreach ($this->students as $student) {
            foreach ($student->guardians ?? [] as $g) {
                $addr = $g->address;

                $this->rows[] = [
                    $student->ref_number ?? $student->id,
                    trim(($student->fname ?? '') . ' ' . ($student->lname ?? '')),
                    $g->role ?? '',
                    $g->fname ?? '',
                    $g->mname ?? '',
                    $g->lname ?? '',
                    $g->suffix ?? '',
                    $g->birthdate ?? '',
                    $g->birthplace ?? '',
                    $g->mobile_num ?? '',
                    $g->religion ?? '',
                    $g->citizenship ?? '',
                    $g->highest_educ_attainment ?? '',
                    $g->occupation ?? '',
                    $g->life_status ?? '',
                    $g->cause_of_death ?? '',
                    $g->year_of_death ?? '',
                    $g->is_contact_person ? 'Yes' : 'No',
                    $addr?->brgy ?? '',
                    $addr?->city ?? '',
                    $addr?->province ?? '',
                    $addr?->region ?? '',
                    $addr?->island ?? '',
                    $addr?->zip_code ?? '',
                ];
            }
        }
    }

    public function title(): string
    {
        return 'Guardians';
    }

    public function headings(): array
    {
        return [
            'Student Ref #',
            'Student Name',
            'Role',
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Gender',
            'Birthdate',
            'Birthplace',
            'Mobile',
            'Religion',
            'Citizenship',
            'Highest Educ. Attainment',
            'Occupation',
            'Life Status',
            'Cause of Death',
            'Year of Death',
            'Is Contact Person',
            'Address (Brgy)',
            'City',
            'Province',
            'Region',
            'Island',
            'Zip Code',
        ];
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        return $this->headerAndBorderStyles(count($this->rows), 'X');
    }
}

/**
 * Education history sheet — one row per education record
 */
class EducationTableSheet implements FromArray, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{
    use StyledSheet;

    private array $rows = [];

    public function __construct(private readonly Collection $students)
    {
        foreach ($this->students as $student) {
            foreach ($student->educations ?? [] as $e) {
                $this->rows[] = [
                    $student->ref_number ?? $student->id,
                    trim(($student->fname ?? '') . ' ' . ($student->lname ?? '')),
                    $e->education_level ?? '',
                    $e->school_name ?? '',
                    $e->school_address ?? '',
                    $e->school_type ?? '',
                    $e->strand ?? '',
                    $e->course ?? '',
                    $e->academic_year ?? '',
                    $e->year_graduated ?? '',
                    $e->general_average ?? '',
                    $e->scholarship_program ?? '',
                    $e->scholarship_address ?? '',
                    $e->scholarship_mobile_num ?? '',
                ];
            }
        }
    }

    public function title(): string
    {
        return 'Education';
    }

    public function headings(): array
    {
        return [
            'Student Ref #',
            'Student Name',
            'Education Level',
            'School Name',
            'School Address',
            'School Type',
            'Strand',
            'Course',
            'Academic Year',
            'Year Graduated',
            'General Average',
            'Scholarship Program',
            'Scholarship Address',
            'Scholarship Mobile #',
        ];
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        return $this->headerAndBorderStyles(count($this->rows), 'N');
    }
}

/**
 * Siblings sheet — one row per sibling
 */
class SiblingsTableSheet implements FromArray, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{
    use StyledSheet;

    private array $rows = [];

    public function __construct(private readonly Collection $students)
    {
        foreach ($this->students as $student) {
            foreach ($student->siblings ?? [] as $s) {
                $this->rows[] = [
                    $student->ref_number ?? $student->id,
                    trim(($student->fname ?? '') . ' ' . ($student->lname ?? '')),
                    $s->fname ?? '',
                    $s->mname ?? '',
                    $s->lname ?? '',
                    $s->suffix ?? '',
                    $s->is_attending_college ? 'Yes' : 'No',
                    $s->is_employed ? 'Yes' : 'No',
                ];
            }
        }
    }

    public function title(): string
    {
        return 'Siblings';
    }

    public function headings(): array
    {
        return [
            'Student Ref #',
            'Student Name',
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Attending College',
            'Employed',
        ];
    }

    public function array(): array
    {
        return $this->rows;
    }

    public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        return $this->headerAndBorderStyles(count($this->rows), 'H');
    }
}

/**
 * Family info sheet — one row per student (hasOne relation)
 */
class FamilyInfoTableSheet implements FromArray, WithHeadings, ShouldAutoSize, WithStyles, WithTitle
{
    use StyledSheet;

    public function __construct(private readonly Collection $students) {}

    public function title(): string
    {
        return 'Family Info';
    }

    public function headings(): array
    {
        return [
            'Student Ref #',
            'Student Name',
            'Family Size',
            'Parent Marital Status',
            'Nature of Residence',
            'House Monthly Income',
            'Ordinal Position',
        ];
    }

    public function array(): array
    {
        return $this->students->map(function ($student) {
            $f = $student->familyInfo;

            return [
                $student->ref_number ?? $student->id,
                trim(($student->fname ?? '') . ' ' . ($student->lname ?? '')),
                $f?->family_size ?? '',
                $f?->parent_martial_status ?? '',
                $f?->nature_residence ?? '',
                $f?->house_monthly_income ?? '',
                $f?->ordinal_position ?? '',
            ];
        })->toArray();
    }

    public function styles(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet $sheet): array
    {
        return $this->headerAndBorderStyles(count($this->students), 'G');
    }
}

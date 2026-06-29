<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

// ══════════════════════════════════════════════════════════════════════════════
// Main export — one workbook, one sheet per section
// ══════════════════════════════════════════════════════════════════════════════

class StudentFullExport implements WithMultipleSheets
{
    public function __construct(private readonly mixed $student) {}

    public function sheets(): array
    {
        $sheets = [
            new StudentProfileSheet($this->student),
            new StudentAddressSheet($this->student->address),
            new StudentEducationSheet($this->student->educations),
            new StudentGuardiansSheet($this->student->guardians),
        ];

        if (($this->student->siblings?->count() ?? 0) > 0) {
            $sheets[] = new StudentSiblingsSheet($this->student->siblings);
        }

        if ($this->student->familyInfo) {
            $sheets[] = new StudentFamilySheet($this->student->familyInfo);
        }

        return $sheets;
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Shared styling helper
// ══════════════════════════════════════════════════════════════════════════════

class ExcelSheetHelper
{
    /** Converts a 1-based column count to an Excel letter (1→A, 27→AA, …). */
    public static function columnLetter(int $n): string
    {
        $letter = '';
        while ($n > 0) {
            $n--;
            $letter = chr(65 + ($n % 26)) . $letter;
            $n      = (int) ($n / 26);
        }
        return $letter;
    }

    /**
     * Returns PhpSpreadsheet-compatible style array:
     *   - Row 1  : teal background, bold white text, centred
     *   - All cells: thin light-grey border
     *   - Even data rows: very light mint background
     */
    public static function baseStyles(int $dataRows, int $cols): array
    {
        $lastCol = self::columnLetter($cols);
        $lastRow = $dataRows + 1; // +1 for the heading row

        $styles = [
            // ── Header ───────────────────────────────────────────────────────
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
            // ── Borders on every cell ────────────────────────────────────────
            "A1:{$lastCol}{$lastRow}" => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color'       => ['rgb' => 'CCCCCC'],
                    ],
                ],
            ],
        ];

        // ── Alternating mint tint on even data rows ───────────────────────────
        for ($row = 3; $row <= $lastRow; $row += 2) {
            $styles[$row] = [
                'fill' => [
                    'fillType'   => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'F0FAF7'],
                ],
            ];
        }

        return $styles;
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Sheet 1 — Student Profile
// ══════════════════════════════════════════════════════════════════════════════

class StudentProfileSheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    public function __construct(private readonly mixed $student) {}

    public function title(): string
    {
        return 'Profile';
    }

    public function headings(): array
    {
        return [
            'Reference #',
            'Status',
            'Academic Year',
            'Semester',
            'LRN',
            'Year Level',
            'Campus',
            'Course',
            'Major',
            'Date Admitted',
            'Student Type',
            'Equity Indicator',
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Birthdate',
            'Birthplace',
            'Email',
            'Mobile Number',
            'Weekly Allowance',
            'Financer',
            'Last Attended School',
            'Religion',
            'Citizenship',
            'Civil Status',
            'Sexual Orientation',
            'Height (cm)',
            'Weight (kg)',
        ];
    }

    public function array(): array
    {
        $s = $this->student;
        return [[
            $s->ref_number ?? '',
            $s->status ?? '',
            $s->academic_year ?? '',
            $s->semester ?? '',
            $s->lrn ?? '',
            $s->year_level ?? '',
            $s->campus ?? '',
            $s->course ?? '',
            $s->major ?? '',
            $s->date_admitted ?? '',
            $s->student_type ?? '',
            $s->equity_indicator ?? '',
            $s->fname ?? '',
            $s->mname ?? '',
            $s->lname ?? '',
            $s->suffix ?? '',
            $s->birthdate ?? '',
            $s->birthplace ?? '',
            $s->email ?? '',
            $s->mobile_num ?? '',
            $s->weekly_allowance ?? '',
            $s->financer ?? '',
            $s->last_attended_school ?? '',
            $s->religion ?? '',
            $s->citizenship ?? '',
            $s->civil_status ?? '',
            $s->sexual_orient ?? '',
            $s->height ?? '',
            $s->weight ?? '',
        ]];
    }

    public function styles(Worksheet $sheet): array
    {
        return ExcelSheetHelper::baseStyles(count($this->array()), count($this->headings()));
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Sheet 2 — Address
// ══════════════════════════════════════════════════════════════════════════════

class StudentAddressSheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    public function __construct(private readonly mixed $address) {}

    public function title(): string
    {
        return 'Address';
    }

    public function headings(): array
    {
        return ['Island Group', 'Region', 'Province', 'City / Municipality', 'Barangay', 'Zip Code'];
    }

    public function array(): array
    {
        if (!$this->address) {
            return [array_fill(0, 6, '')];
        }
        $a = $this->address;
        return [[
            $a->island    ?? '',
            $a->region    ?? '',
            $a->province  ?? '',
            $a->city      ?? '',
            $a->brgy      ?? '',
            $a->zip_code  ?? '',
        ]];
    }

    public function styles(Worksheet $sheet): array
    {
        return ExcelSheetHelper::baseStyles(count($this->array()), count($this->headings()));
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Sheet 3 — Education
// ══════════════════════════════════════════════════════════════════════════════

class StudentEducationSheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    public function __construct(private readonly mixed $educations) {}

    public function title(): string
    {
        return 'Education';
    }

    public function headings(): array
    {
        return [
            'Level',
            'School Name',
            'School Address',
            'School Type',
            'Year Graduated',
            'General Average',
            'Strand',
            'Course',
            'Academic Year',
            'Scholarship Program',
            'Scholarship Address',
            'Scholarship Mobile',
        ];
    }

    public function array(): array
    {
        $data = [];
        foreach ($this->educations ?? [] as $e) {
            $data[] = [
                $e->education_level        ?? '',
                $e->school_name            ?? '',
                $e->school_address         ?? '',
                $e->school_type            ?? '',
                $e->year_graduated         ?? '',
                $e->general_average        ?? '',
                $e->strand                 ?? '',
                $e->course                 ?? '',
                $e->academic_year          ?? '',
                $e->scholarship_program    ?? '',
                $e->scholarship_address    ?? '',
                $e->scholarship_mobile_num ?? '',
            ];
        }
        return $data ?: [array_fill(0, 12, '')];
    }

    public function styles(Worksheet $sheet): array
    {
        return ExcelSheetHelper::baseStyles(count($this->array()), count($this->headings()));
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Sheet 4 — Guardians
// ══════════════════════════════════════════════════════════════════════════════

class StudentGuardiansSheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    public function __construct(private readonly mixed $guardians) {}

    public function title(): string
    {
        return 'Guardians';
    }

    public function headings(): array
    {
        return [
            'Role',
            'First Name',
            'Middle Name',
            'Last Name',
            'Suffix',
            'Birthdate',
            'Birthplace',
            'Mobile',
            'Religion',
            'Citizenship',
            'Highest Education',
            'Life Status',
            'Cause of Death',
            'Year of Death',
            'Occupation',
            'Contact Person',
            'Region',
            'Province',
            'City',
            'Barangay',
            'Zip Code',
        ];
    }

    public function array(): array
    {
        $data = [];
        foreach ($this->guardians ?? [] as $g) {
            $addr  = $g->address ?? null;
            $data[] = [
                $g->role                      ?? '',
                $g->fname                     ?? '',
                $g->mname                     ?? '',
                $g->lname                     ?? '',
                $g->suffix                    ?? '',
                $g->birthdate                 ?? '',
                $g->birthplace                ?? '',
                $g->mobile_num                ?? '',
                $g->religion                  ?? '',
                $g->citizenship               ?? '',
                $g->highest_educ_attainment   ?? '',
                $g->life_status               ?? '',
                $g->cause_of_death            ?? '',
                $g->year_of_death             ?? '',
                $g->occupation                ?? '',
                !empty($g->is_contact_person) ? 'Yes' : 'No',
                $addr->region   ?? '',
                $addr->province ?? '',
                $addr->city     ?? '',
                $addr->brgy     ?? '',
                $addr->zip_code ?? '',
            ];
        }
        return $data ?: [array_fill(0, 21, '')];
    }

    public function styles(Worksheet $sheet): array
    {
        return ExcelSheetHelper::baseStyles(count($this->array()), count($this->headings()));
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Sheet 5 — Siblings (only included when student has siblings)
// ══════════════════════════════════════════════════════════════════════════════

class StudentSiblingsSheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    public function __construct(private readonly mixed $siblings) {}

    public function title(): string
    {
        return 'Siblings';
    }

    public function headings(): array
    {
        return ['First Name', 'Middle Name', 'Last Name', 'Suffix', 'Attending College', 'Employed'];
    }

    public function array(): array
    {
        $data = [];
        foreach ($this->siblings ?? [] as $s) {
            $data[] = [
                $s->fname  ?? '',
                $s->mname  ?? '',
                $s->lname  ?? '',
                $s->suffix ?? '',
                !empty($s->is_attending_college) ? 'Yes' : 'No',
                !empty($s->is_employed)          ? 'Yes' : 'No',
            ];
        }
        return $data ?: [array_fill(0, 6, '')];
    }

    public function styles(Worksheet $sheet): array
    {
        return ExcelSheetHelper::baseStyles(count($this->array()), count($this->headings()));
    }
}

// ══════════════════════════════════════════════════════════════════════════════
// Sheet 6 — Family Info (only included when family info exists)
// ══════════════════════════════════════════════════════════════════════════════

class StudentFamilySheet implements FromArray, WithHeadings, WithTitle, ShouldAutoSize, WithStyles
{
    public function __construct(private readonly mixed $family) {}

    public function title(): string
    {
        return 'Family';
    }

    public function headings(): array
    {
        return [
            'Family Size',
            "Parents' Marital Status",
            'Nature of Residence',
            'Household Monthly Income',
            'Ordinal Position',
        ];
    }

    public function array(): array
    {
        if (!$this->family) {
            return [array_fill(0, 5, '')];
        }
        $f = $this->family;
        return [[
            $f->family_size            ?? '',
            $f->parent_martial_status  ?? '',
            $f->nature_residence       ?? '',
            $f->house_monthly_income   ?? '',
            $f->ordinal_position       ?? '',
        ]];
    }

    public function styles(Worksheet $sheet): array
    {
        return ExcelSheetHelper::baseStyles(count($this->array()), count($this->headings()));
    }
}

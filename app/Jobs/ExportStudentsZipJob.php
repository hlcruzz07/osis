<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Database\Eloquent\Collection;
use Maatwebsite\Excel\Facades\Excel;
use ZipArchive;

use App\Exports\StudentExport;
use App\Exports\AddressExport;
use App\Exports\SiblingsExport;
use App\Exports\GuardiansExport;
use Illuminate\Support\Facades\Log;

class ExportStudentsZipJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Collection $students,

    ) {
    }

    public function handle(): void
    {
        // Ensure relations are loaded (queue safety)
        $this->students->load([
            'guardians.address',
            'address',
            'educations',
            'siblings',
            'familyInfo'
        ]);

        $fileName = "students.zip";
        $zipPath = storage_path("app/exports/{$fileName}");

        $zip = new ZipArchive;

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            Log::error('ZIP FAILED');
            return;
        }

        foreach ($this->students as $student) {

            $fullName = trim("{$student->fname} {$student->mname} {$student->lname} {$student->suffix}");

            $folder = "students/{$fullName}/";

            // PROFILE
            $zip->addFromString(
                $folder . 'profile.xlsx',
                Excel::raw(new StudentExport($student), \Maatwebsite\Excel\Excel::XLSX)
            );

            // ADDRESS
            $zip->addFromString(
                $folder . 'address.xlsx',
                Excel::raw(new AddressExport($student->address), \Maatwebsite\Excel\Excel::XLSX)
            );

            // SIBLINGS
            if ($student->siblings->count() > 0) {
                $zip->addFromString(
                    $folder . 'siblings.xlsx',
                    Excel::raw(new SiblingsExport($student->siblings), \Maatwebsite\Excel\Excel::XLSX)
                );
            }

            // GUARDIANS
            $zip->addFromString(
                $folder . 'guardians.xlsx',
                Excel::raw(new GuardiansExport($student->guardians), \Maatwebsite\Excel\Excel::XLSX)
            );
        }

        $zip->close();

    }
}
<?php

namespace App\Jobs;

use App\Exports\StudentFullExport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use ZipArchive;

class ExportStudentsZipJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public Collection $students) {}

    public function handle(): void
    {
        // Ensure relations are loaded (queue safety)
        $this->students->load([
            'guardians.address',
            'address',
            'educations',
            'siblings',
            'familyInfo',
        ]);

        $exportDir = storage_path('app/exports');

        if (!is_dir($exportDir)) {
            mkdir($exportDir, 0755, true);
        }

        $zipPath = $exportDir . '/students.zip';
        $zip     = new ZipArchive();

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            Log::error("ExportStudentsZipJob: cannot create ZIP at {$zipPath}", [
                'status'  => $zip->getStatusString(),
                'dir_exists' => is_dir($exportDir),
                'writable'   => is_writable($exportDir),
            ]);
            return;
        }

        foreach ($this->students as $student) {
            // Build a safe filename from the student's full name
            $fullName = implode(' ', array_filter([
                $student->fname,
                $student->mname,
                $student->lname,
                $student->suffix,
            ]));

            $safeFileName = trim(preg_replace('/[^\w\-. ]/u', '_', $fullName));
            $safeFileName = $safeFileName ?: "student_{$student->id}";

            $zip->addFromString(
                "students/{$safeFileName}.xlsx",
                Excel::raw(new StudentFullExport($student), \Maatwebsite\Excel\Excel::XLSX)
            );
        }

        $zip->close();
    }
}

<?php

namespace App\Jobs;

use App\Exports\StudentsCollectionExport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

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

        $excelPath = $exportDir . '/students.xlsx';

        try {
            Excel::store(
                new StudentsCollectionExport($this->students),
                'exports/students.xlsx',
                'local'
            );

            Log::info("ExportStudentsZipJob: Successfully created single Excel file at {$excelPath}");
        } catch (\Exception $e) {
            Log::error("ExportStudentsZipJob: Failed to create Excel file", [
                'error' => $e->getMessage(),
                'path'  => $excelPath,
            ]);
        }
    }
}

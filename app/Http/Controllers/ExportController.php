<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExportController extends Controller
{
    public function downloadExcel()
    {
        $path = storage_path("app/exports/students.zip");

        if (!file_exists($path)) {
            return response()->json([
                'message' => 'File not ready yet.',
            ], 404);
        }

        return response()->download($path, 'students.zip')
            ->deleteFileAfterSend(true);
    }

    public function downloadPdf()
    {
        $path = storage_path("app/exports/students.pdf");

        if (!file_exists($path)) {
            return response()->json([
                'message' => 'File not ready yet.',
            ], 404);
        }

        return response()->download($path, 'students.pdf')
            ->deleteFileAfterSend(true);
    }
}
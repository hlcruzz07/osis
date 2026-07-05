<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentFilterRequest;
use App\Repositories\StudentRepo;
use App\Services\GoogleDriveService;
use Exception;
use Illuminate\Http\Request;

class StudentApiController extends Controller
{
    public function __construct(protected StudentRepo $studentRepo, protected GoogleDriveService $googleDriveService) {}
    public function paginate(StudentFilterRequest $request)
    {
        try {
            $data = $this->studentRepo->paginate($request->all());

            return response()->json($data);
        } catch (Exception $e) {

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function getStudentsPerDateFilter(Request $request)
    {
        try {
            $data = $this->studentRepo->getStudentsPerDateFilter($request->date);

            return response()->json($data);
        } catch (Exception $e) {

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function image(string $fileId)
    {
        return $this->googleDriveService->getGDriveImage($fileId);
    }
}

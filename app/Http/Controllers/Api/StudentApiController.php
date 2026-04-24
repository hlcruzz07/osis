<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudentFilterRequest;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;

class StudentApiController extends Controller
{
    public function __construct(protected StudentRepo $studentRepo)
    {
    }
    public function paginate(StudentFilterRequest $request)
    {
        try {
            $data = $this->studentRepo->paginate($request->validated());

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

}

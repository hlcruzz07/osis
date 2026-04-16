<?php

namespace App\Http\Controllers;

use App\Http\Requests\EducationInfoRequest;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EducationController extends Controller
{
    public function __construct(protected StudentRepo $studentRepo)
    {
    }
    public function update(EducationInfoRequest $request)
    {
        try {

            $this->studentRepo->updateEducations($request->all());

            return back()->with('success', 'Education Information updated!');

        } catch (Exception $e) {

            Log::error("Failed to update education info for student" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }

}

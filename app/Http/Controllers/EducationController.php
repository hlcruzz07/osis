<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\EducationInfoRequest;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EducationController extends Controller
{
    public function __construct(protected StudentRepo $studentRepo)
    {
    }
    public function update(EducationInfoRequest $request)
    {

        try {
            $student_ids = $this->studentRepo->updateEducations($request->all());

            ActivityLog::log('update', "updated educational background information for student id(s): " . implode(', ', $student_ids), Auth::user()->email, request(), 'success');

            return back()->with('success', 'Education Information updated!');

        } catch (Exception $e) {

            ActivityLog::log('update', "failed to update educational background information: " . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to update education info for student" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }

}

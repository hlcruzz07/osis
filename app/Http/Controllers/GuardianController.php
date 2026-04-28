<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\CreateGuardianRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Repositories\GuardianRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GuardianController extends Controller
{
    public function __construct(protected GuardianRepo $guardianRepo)
    {
    }
    public function update(UpdateGuardianRequest $request, int $id)
    {
        try {

            $guardian = $this->guardianRepo->updateGuardianById($id, $request->all());

            $student_id = $guardian->student_id;

            ActivityLog::log('update', "updated guardian information for student id: $student_id", Auth::user()->email, request(), 'success');

            return back()->with('success', 'Guardian Information updated!');

        } catch (Exception $e) {

            ActivityLog::log('update', "failed to updated guardian information: " . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to update guardian info for student" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }

    public function store(CreateGuardianRequest $request, int $student_id)
    {
        try {

            $this->guardianRepo->store($request->all(), $student_id);

            ActivityLog::log('create', "created new guardian for student id: " . $student_id, Auth::user()->email, request(), 'success');

            return back()->with('success', 'New Guardian added!');

        } catch (Exception $e) {

            ActivityLog::log('create', "failed to create a new guardian for student id $student_id: " . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to add guardian for student" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }
}

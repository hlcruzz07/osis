<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateGuardianRequest;
use App\Http\Requests\UpdateGuardianRequest;
use App\Repositories\GuardianRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GuardianController extends Controller
{
    public function __construct(protected GuardianRepo $guardianRepo)
    {
    }
    public function update(UpdateGuardianRequest $request, int $id)
    {
        try {

            $this->guardianRepo->updateGuardianById($id, $request->all());

            return back()->with('success', 'Guardian Information updated!');

        } catch (Exception $e) {

            Log::error("Failed to update guardian info for student" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }

    public function store(CreateGuardianRequest $request, int $student_id)
    {
        try {

            $this->guardianRepo->store($request->all(), $student_id);

            return back()->with('success', 'New Guardian added!');

        } catch (Exception $e) {

            Log::error("Failed to add guardian for student" . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }
}

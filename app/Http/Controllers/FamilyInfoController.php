<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\UpdateFamilyInfoRequest;
use App\Repositories\FamilyInfoRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FamilyInfoController extends Controller
{
    public function __construct(protected FamilyInfoRepo $familyInfoRepo)
    {
    }
    public function update(UpdateFamilyInfoRequest $request, int $id)
    {
        try {

            $this->familyInfoRepo->update($id, $request->all());

            ActivityLog::log('update', "updated family information for student id: " . $id, Auth::user()->email, request(), 'success');

            return back()->with('success', 'Family Information updated!');

        } catch (Exception $e) {

            ActivityLog::log('update', "failed to update family information for student id $id" . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to update family info for student $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }
}

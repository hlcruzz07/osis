<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateFamilyInfoRequest;
use App\Repositories\FamilyInfoRepo;
use Exception;
use Illuminate\Http\Request;
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

            return back()->with('success', 'Family Information updated!');

        } catch (Exception $e) {

            Log::error("Failed to update family info for student $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }
}

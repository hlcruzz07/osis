<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\UpdateAddressInfoRequest;
use App\Repositories\AddressRepo;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AddressController extends Controller
{
    public function __construct(protected AddressRepo $addressRepo)
    {
    }

    public function updateStudentAddress(UpdateAddressInfoRequest $request, int $id)
    {
        try {

            $this->addressRepo->updateAddressByStudentId($id, $request->all());

            ActivityLog::log('update', "updated address information for student id: $id", Auth::user()->email, request(), 'success');

            return back()->with('success', 'Student Address updated!');

        } catch (Exception $e) {

            ActivityLog::log('update', "failed to update address information for student id $id: " . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to update address info for student $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }
    public function updateGuardianAddress(UpdateAddressInfoRequest $request, int $id)
    {
        try {

            $address = $this->addressRepo->updateAddressByGuardianId($id, $request->all());

            $student_id = $address->student_id;

            ActivityLog::log('update', "updated guardian address information for student id: $student_id", Auth::user()->email, request(), 'success');

            return back()->with('success', 'Guardian Address updated!');

        } catch (Exception $e) {

            ActivityLog::log('update', "failed to update guardian address information for id $id: " . $e->getMessage(), Auth::user()->email, request(), 'failed');

            Log::error("Failed to update address info for guardian $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }



}

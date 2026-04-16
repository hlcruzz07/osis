<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateAddressInfoRequest;
use App\Repositories\AddressRepo;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;
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

            return back()->with('success', 'Student Address updated!');

        } catch (Exception $e) {

            Log::error("Failed to update address info for student $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }
    public function updateGuardianAddress(UpdateAddressInfoRequest $request, int $id)
    {
        try {

            $this->addressRepo->updateAddressByGuardianId($id, $request->all());

            return back()->with('success', 'Guardian Address updated!');

        } catch (Exception $e) {

            Log::error("Failed to update address info for guardian $id: " . $e->getMessage());

            return back()->with('error', 'Something went wrong, please try again.');
        }
    }



}

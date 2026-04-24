<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\UserRepo;
use Exception;
use Illuminate\Http\Request;

class AccountApiController extends Controller
{
    public function __construct(protected UserRepo $userRepo)
    {
        //
    }
    public function paginate(Request $request)
    {
        try {
            $activities = $this->userRepo->paginate($request->all());

            return response()->json($activities);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch activities',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

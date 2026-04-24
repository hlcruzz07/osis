<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\ActivityLogRepo;
use Exception;
use Illuminate\Http\Request;

class ActivityLogApiController extends Controller
{

    public function __construct(protected ActivityLogRepo $activityLogRepo)
    {
        //
    }
    public function paginate(Request $request)
    {
        try {
            $activities = $this->activityLogRepo->paginate($request->all());

            return response()->json($activities);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch activities',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

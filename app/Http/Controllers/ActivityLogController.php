<?php

namespace App\Http\Controllers;

use App\Repositories\ActivityLogRepo;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function __construct(
        protected ActivityLogRepo $logRepo
    ) {
        //
    }

    public function index()
    {
        $activityActionCount = cache()->remember('activity_actions_count', 60 * 60 * 24, fn() => $this->logRepo->getActivityActionsCount());

        return Inertia::render('Admin/ActivityLogs/Index', [
            'activity_actions_count' => $activityActionCount,
        ]);
    }
}

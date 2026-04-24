<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    public function log(
        string $action,
        string $description,
        ?string $email = null,
        ?Request $request = null,
        string $status = 'success'
    ) {
        ActivityLog::create([
            'email' => $email ?? 'test@gmail.com',
            'action' => $action,
            'description' => $description,
            'ip_address' => $request->ip(),
            'browser' => $request->userAgent(),
            'status' => $status
        ]);
    }

}
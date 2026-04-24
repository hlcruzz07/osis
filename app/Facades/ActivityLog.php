<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class ActivityLog extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \App\Services\ActivityLogService::class;
    }
}
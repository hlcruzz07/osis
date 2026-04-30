<?php

use App\Http\Controllers\Api\AccountApiController;
use App\Http\Controllers\Api\ActivityLogApiController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\RoleApiController;
use App\Http\Controllers\Api\StudentApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['custom.auth', 'throttle:60,1'])->group(function () {
    Route::get('/students/paginate', [StudentApiController::class, 'paginate'])->name('paginateStudents')->middleware('permission:view_students');
    Route::get('/students/getStudentsPerDateFilter/{date}', [StudentApiController::class, 'getStudentsPerDateFilter'])->name('getStudentsPerDateFilter')->middleware('permission:view_students');
    Route::get('/activity-logs/paginate', [ActivityLogApiController::class, 'paginate'])->name('paginateActivityLogs')->middleware('permission:view_activity_logs');

    Route::get('/accounts/paginate', [AccountApiController::class, 'paginate'])->name('paginateAccounts')->middleware(['role:super_administrator', 'permission:view_accounts']);
    Route::get('/roles/paginate', [RoleApiController::class, 'paginate'])->name('paginateRoles')->middleware(['role:super_administrator', 'permission:view_roles']);
});


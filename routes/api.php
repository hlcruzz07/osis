<?php

use App\Http\Controllers\Api\AccountApiController;
use App\Http\Controllers\Api\ActivityLogApiController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\StudentApiController;
use Illuminate\Support\Facades\Route;

Route::middleware(['custom.auth', 'role:admin|super_admin', 'throttle:60,1'])->group(function () {
    Route::get('/students/paginate', [StudentApiController::class, 'paginate'])->name('paginateStudents');
    Route::get('/students/getStudentsPerDateFilter/{date}', [StudentApiController::class, 'getStudentsPerDateFilter'])->name('getStudentsPerDateFilter');
    Route::get('/activity-logs/paginate', [ActivityLogApiController::class, 'paginate'])->name('paginateActivityLogs');
    Route::get('/accounts/paginate', [AccountApiController::class, 'paginate'])->name('paginateAccounts');
});


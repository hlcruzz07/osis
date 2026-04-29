<?php

use App\Http\Controllers\AcademicYearAndSemesterController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FamilyInfoController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

Route::get("/", [StudentController::class, 'index'])->name('home');

// Student Validations & Submission
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/student/validate/student-info', [StudentController::class, 'validateStudentInfo'])->name('validateStudentInfo');
    Route::post('/student/validate/student-address', [StudentController::class, 'validateAddress'])->name('validateAddress');
    Route::post('/student/validate/education', [StudentController::class, 'validateEducation'])->name('validateEducation');
    Route::post('/student/validate/family', [StudentController::class, 'validateFamily'])->name('validateFamily');
    Route::post('/student/validate/additional-info', [StudentController::class, 'validateAdditionalInfo'])->name('validateAdditionalInfo');
    Route::post('/student/store', [StudentController::class, 'store'])->name('storeStudent');
});

// Admin Routes

Route::get('/admin', [AuthController::class, 'index'])->name('admin');
Route::get('/auth/google/redirect', [AuthController::class, 'redirect'])->name('login');
Route::get('/auth/google/callback', [AuthController::class, 'callback']);

// Auth
Route::middleware(['custom.auth', 'throttle:60,1'])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::middleware('permission:view_students')->group(function () {
        Route::get('/students', [StudentController::class, 'students'])->name('students');
        Route::get('/student/{id}', [StudentController::class, 'view'])->name('viewStudent');
    });


    Route::middleware('permission:export_students')->group(function () {
        Route::post('/students/export', [StudentController::class, 'export'])->name('exportStudents');
        Route::get('/download', [ExportController::class, 'download']);
    });

    Route::middleware('permission:update_students')->group(function () {
        Route::put('/student/{id}/student', [StudentController::class, 'update'])->name('updateStudent');
        Route::put('/student/{id}/student-address', [AddressController::class, 'updateStudentAddress'])->name('updateStudentAddress');
        Route::put('/student/{id}/family-info', [FamilyInfoController::class, 'update'])->name('updateFamily');
        Route::put('/student/{id}/education', [EducationController::class, 'update'])->name('updateEducation');
        Route::put('/student/{id}/guardian', [GuardianController::class, 'update'])->name('updateGuardian');
    });

    Route::middleware('permission:create_students')->group(function () {
        Route::post('/student/{student_id}/guardian/create', [GuardianController::class, 'create'])->name('createGuardian');
    });

    Route::middleware('permission:update_academic_year_and_semester')->group(function () {
        Route::put('/academic-year-and-semester', [AcademicYearAndSemesterController::class, 'update'])->name('updateAcademicYearAndSemester');
    });

    Route::middleware(['permission:view_activity_logs'])->group(function () {
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activityLogs');
    });

    Route::middleware(['permission:view_accounts|create_accounts|update_accounts|delete_accounts', 'role:super_admin'])->group(function () {
        Route::get('/accounts', [AccountController::class, 'index'])->name('accounts');
        Route::post('/accounts/create', [AccountController::class, 'create'])->name('createAccount');
        Route::put('/accounts/{id}/update', [AccountController::class, 'update'])->name('updateAccount');
    });

    Route::middleware(['permission:view_roles|create_roles|update_roles|delete_roles', 'role:super_admin'])->group(function () {
        Route::get('/roles', [RoleController::class, 'index'])->name('roles');
        Route::post('/roles/create', [RoleController::class, 'create'])->name('createRole');
        Route::put('/roles/{id}/update', [RoleController::class, 'update'])->name('updateRole');
    });

    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});
require __DIR__ . '/api.php';

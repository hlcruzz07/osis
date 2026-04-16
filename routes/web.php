<?php

use App\Http\Controllers\AcademicYearAndSemesterController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FamilyInfoController;
use App\Http\Controllers\GuardianController;
use App\Http\Controllers\StudentController;
use App\Models\AcademicYearAndSemester;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return redirect('/student');
});

Route::get('/student', [StudentController::class, 'index'])->name('home');

// Student Validations & Submission
Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/student/validate/student-info', [StudentController::class, 'validateStudentInfo'])->name('validateStudentInfo');
    Route::post('/student/validate/student-address', [StudentController::class, 'validateAddress'])->name('validateAddress');
    Route::post('/student/validate/education', [StudentController::class, 'validateEducation'])->name('validateEducation');
    Route::post('/student/validate/family', [StudentController::class, 'validateFamily'])->name('validateFamily');
    Route::post('/student/validate/additional-info', [StudentController::class, 'validateAdditionalInfo'])->name('validateAdditionalInfo');
    Route::post('/student/store', [StudentController::class, 'store'])->name('storeStudent');
});

// Admin Routes

// Students
Route::get('/students', [StudentController::class, 'students'])->name('students');
Route::get('/student/{id}', [StudentController::class, 'view'])->name('viewStudent');
Route::put('/student/{id}/student', [StudentController::class, 'update'])->name('updateStudent');
Route::post('/students/export', [StudentController::class, 'export'])->name('exportStudents');
Route::get('/download', [ExportController::class, 'download']);

Route::get('/test', [StudentController::class, 'export']);

// Address
Route::put('/student/{id}/student-address', [AddressController::class, 'updateStudentAddress'])->name('updateStudentAddress');

// Family
Route::put('/student/{id}/family-info', [FamilyInfoController::class, 'update'])->name('updateFamily');

// Education
Route::put('/student/{id}/education', [EducationController::class, 'update'])->name('updateEducation');

// Guardian
Route::put('/student/{id}/guardian', [GuardianController::class, 'update'])->name('updateGuardian');
Route::post('/student/{student_id}/guardian/create', [GuardianController::class, 'create'])->name('createGuardian');

Route::put('/academic-year-and-semester', [AcademicYearAndSemesterController::class, 'update'])->name('updateAcademicYearAndSemester');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
require __DIR__ . '/settings.php';
require __DIR__ . '/api.php';

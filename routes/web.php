<?php

use App\Http\Controllers\AdminStudentsController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [StudentController::class, 'index'])->name('home');

// Student Validations & Submission
Route::middleware(['throttle:10,1'])->group(function () {
    Route::post('/student/validate/student-info', [StudentController::class, 'validateStudentInfo'])->name('validateStudentInfo');
    Route::post('/student/validate/student-address', [StudentController::class, 'validateAddress'])->name('validateAddress');
    Route::post('/student/validate/education', [StudentController::class, 'validateEducation'])->name('validateEducation');
    Route::post('/student/validate/family', [StudentController::class, 'validateFamily'])->name('validateFamily');
    Route::post('/student/validate/additional-info', [StudentController::class, 'validateAdditionalInfo'])->name('validateAdditionalInfo');
    Route::post('/student/store', [StudentController::class, 'store'])->name('storeStudent');
});


Route::get('/students', [AdminStudentsController::class, 'index'])->name('students');
Route::get('/student/{id}', [AdminStudentsController::class, 'view'])->name('viewStudent');
Route::put('/student/{id}/student-info', [AdminStudentsController::class, 'updateStudentInfo'])->name('updateStudentInfo');
Route::put('/student/{id}/personal-info', [AdminStudentsController::class, 'updatePersonalInfo'])->name('updatePersonalInfo');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/api.php';

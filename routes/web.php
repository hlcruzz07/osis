<?php

use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', [StudentController::class, 'index'])->name('home');

// Validations
Route::middleware('check.student.submitted')->group(function () {
    Route::post('/student/validate/student-info', [StudentController::class, 'validateStudentInfo'])->name('validateStudentInfo');
    Route::post('/student/validate/student-address', [StudentController::class, 'validateStudentContactAddress'])->name('validateStudentContactAddress');
    Route::post('/student/validate/education', [StudentController::class, 'validateEducation'])->name('validateEducation');
    Route::post('/student/validate/family', [StudentController::class, 'validateFamily'])->name('validateFamily');
    Route::post('/student/validate/additional-info', [StudentController::class, 'validateAdditionalInfo'])->name('validateAdditionalInfo');
    Route::post('/student/store', [StudentController::class, 'store'])->name('storeStudent');
});



Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/settings.php';

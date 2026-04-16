<?php

use App\Http\Controllers\Api\StudentApiController;
use Illuminate\Support\Facades\Route;

Route::get('/paginate', [StudentApiController::class, 'paginate'])->name('paginateStudents');
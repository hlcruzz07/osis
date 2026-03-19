<?php

use App\Http\Controllers\Api\StudentApiController;

Route::get('/paginate', [StudentApiController::class, 'paginate'])->name('paginateStudents');
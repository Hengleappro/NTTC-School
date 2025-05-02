<?php 
use App\Http\Controllers\Controller;
use App\Http\Controllers\CourseController;

Route::get('/courses', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class,'show']);

?>
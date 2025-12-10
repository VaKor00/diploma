<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProjectController;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/models', function () {
    return Inertia::render('Models');
});

Route::get('/modelcar/{id}', function () {
    return Inertia::render('Modelcar');
});
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

Route::get('/carstock', function () {
    return Inertia::render('Carstock');
});

Route::get('/carinfo/{id}', function () {
    return Inertia::render('Carinfo');
});

Route::get('/dealer/{id}', function () {
    return Inertia::render('Dealer');
});

Route::get('/credit', function () {
    return Inertia::render('Credit');
});
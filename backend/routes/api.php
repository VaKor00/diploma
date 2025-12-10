<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;


Route::get('/carousel', [ProjectController::class, 'carousel']); // выгрузка для карусели стартовой страницы
Route::get('/startpage', [ProjectController::class, 'startpage']); // выгрузка для блоков стартовой страницы

Route::get('/models', [ProjectController::class, 'models']); // выгрузка для блоков моделей авто
Route::get('/models/{id}', [ProjectController::class, 'showModel']); // выгрузка для блоков моделей авто

Route::get('/city', [ProjectController::class, 'city']); // выгрузка для списка городов
Route::get('/dealers', [ProjectController::class, 'dealers']); // выгрузка для списка дилеров
Route::get('/condition', [ProjectController::class, 'condition']); // выгрузка для списка условий
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ClientController;

Route::get('/files', [ProjectController::class, 'files']);

Route::get('/carousel', [ProjectController::class, 'carousel']); // выгрузка для карусели стартовой страницы
Route::get('/startpage', [ProjectController::class, 'startpage']); // выгрузка для блоков стартовой страницы

Route::get('/models', [ProjectController::class, 'models']); // выгрузка для блоков моделей авто
Route::get('/models/{id}', [ProjectController::class, 'showModel']); // выгрузка блока конкретной модели

Route::get('/city', [ProjectController::class, 'city']); // выгрузка для списка городов
Route::get('/dealers', [ProjectController::class, 'dealers']); // выгрузка для списка дилеров
Route::get('/dealer/{id}', [ProjectController::class, 'dealerID']); // выгрузка для списка дилеров

Route::get('/condition', [ProjectController::class, 'condition']); // выгрузка для списка условий

Route::get('/complectation', [ProjectController::class, 'complectation']); // выгрузка для списка комплектаций

Route::get('/cars', [ProjectController::class, 'cars']); // выгрузка для списка продаваемых автомобилей
Route::get('/cars/{id}', [ProjectController::class, 'showCar']); // выгрузка для блоков моделей авто

Route::get('/colors', [ProjectController::class, 'colors']); // выгрузка блока цветов авто

Route::get('/banks', [ProjectController::class, 'banks']); // выгрузка всех банков

// post запросы

Route::post('/clients', [ClientController::class, 'store']);

use Illuminate\Support\Facades\DB;

Route::post('/clients-test', function (\Illuminate\Http\Request $request) {
    try {
        $id = DB::table('clients')->insertGetId([
            'name'    => $request->input('name'),
            'phone'   => $request->input('phone'),
            'vin_car' => $request->input('vin_car'),
        ]);

        return response()->json([
            'status' => 'ok',
            'id'     => $id,
        ], 201);
    } catch (\Throwable $e) {
        return response()->json([
            'status'  => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});
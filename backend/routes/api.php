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
Route::get('/dealer/{id}', [ProjectController::class, 'dealerID']); // персональная страница дилера

Route::get('/condition', [ProjectController::class, 'condition']); // выгрузка для списка условий

Route::get('/complectation', [ProjectController::class, 'complectation']); // выгрузка для списка комплектаций

Route::get('/cars', [ProjectController::class, 'cars']); // выгрузка для списка продаваемых автомобилей
Route::get('/cars/{id}', [ProjectController::class, 'showCar']); // выгрузка для блоков моделей авто

Route::get('/colors', [ProjectController::class, 'colors']); // выгрузка блока цветов авто

Route::get('/banks', [ProjectController::class, 'banks']); // выгрузка всех банков

Route::get('/clients', [ProjectController::class, 'clients']); // выгрузка клиентов

// post запросы

Route::post('/clients', [ClientController::class, 'store']);

Route::post('/carousel', [ProjectController::class, 'carouselStore']);
Route::put('/carousel/{id}', [ProjectController::class, 'carouselUpdate']);
Route::delete('/carousel/{id}', [ProjectController::class, 'destroy']);

Route::put('/startpage/swap-priority', [ProjectController::class, 'swapPriority']);

Route::post('/startpage', [ProjectController::class, 'startpageStore']);
Route::put('/startpage/{id}', [ProjectController::class, 'startpageUpdate']);
Route::delete('/startpage/{id}', [ProjectController::class, 'startpagedel']);

Route::post('/condition', [ProjectController::class, 'conditionStore']);
Route::put('/condition/{id}', [ProjectController::class, 'conditionUpdate']);
Route::delete('/condition/{id}', [ProjectController::class, 'conditionDel']);

Route::post('/city', [ProjectController::class, 'cityStore']);
Route::delete('/city/{id}', [ProjectController::class, 'cityDel']);

Route::post('/dealers', [ProjectController::class, 'dealersStore']);
Route::put('/dealers/{id}', [ProjectController::class, 'dealersUpdate']);
Route::delete('/dealers/{id}', [ProjectController::class, 'dealersDel']);

Route::post('/models', [ProjectController::class, 'modelStore']);
Route::put('/models/{id}', [ProjectController::class, 'modelUpdate']);
Route::delete('/models/{id}', [ProjectController::class, 'modelDel']);

Route::post('/complectation', [ProjectController::class, 'complectationStore']);
Route::put('/complectation/{id}', [ProjectController::class, 'complectationUpdate']);
Route::delete('/complectation/{id}', [ProjectController::class, 'complectationDel']);

Route::post('/colors', [ProjectController::class, 'storeClr']);
Route::put('/colors/{id}', [ProjectController::class, 'updateClr']);
Route::delete('/colors/{id}', [ProjectController::class, 'destroyClr']);

Route::post('/banks', [ProjectController::class, 'storeBank']);
Route::put('/banks/{id}', [ProjectController::class, 'updateBank']);
Route::delete('/banks/{id}', [ProjectController::class, 'destroyBank']);

// обслуживание логина/пароля дилера

Route::post('/dealers/{dealer}/credentials', [ProjectController::class, 'storeLg']);
Route::put('/dealers/{dealer}/password', [ProjectController::class, 'updatePassword']);

Route::delete('/clients/{id}', [ProjectController::class, 'destroyCli']);

Route::delete('/clients/sale/{id}', [ProjectController::class, 'saleCli']);
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DealerPanelController;
use App\Http\Controllers\UserPanelController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TechnicalServiceController;

use App\Http\Middleware\AdminOnly;
use App\Http\Middleware\DealerOnly;
use App\Http\Middleware\UserOnly;

use App\Models\Dealers;
use App\Models\TechnicalService;

// ------------------ Публичные страницы ------------------

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

// ------------------ Авторизация / регистрация ------------------

// Страница логина
Route::get('/autorization', function () {
    return Inertia::render('Autorization');
})->name('login.form');

// дубликат route '/autorization' у тебя был ниже – убрал второй

// тех же целей можно использовать /login
Route::get('/login', function () {
    return Inertia::render('Autorization');
})->name('login');

// Логин / логаут
Route::post('/login', [AuthController::class, 'login'])->name('login.perform');

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

// Страница регистрации клиента
Route::get('/register', function () {
    return Inertia::render('Register');
})->name('register.form');

// Обработка регистрации клиента
Route::post('/register', [AuthController::class, 'register'])->name('register');

// ------------------ ЛК редактора (админ) ------------------

Route::middleware(['auth', AdminOnly::class])->group(function () {
    Route::get('/editor', function () {
        return Inertia::render('Editor');
    })->name('editor');
});

// ------------------ ЛК дилера ------------------

Route::middleware(['auth', DealerOnly::class])->group(function () {
    Route::get('/dealerpanel', [DealerPanelController::class, 'index'])
        ->name('dealerpanel');
});

// ------------------ Техническое обслуживание (API) ------------------

// свободные слоты ТО
Route::get('/api/technical-service/slots', [TechnicalServiceController::class, 'getAvailableSlots'])
    ->middleware('auth');

// запись на ТО
Route::post('/technical-service', [TechnicalServiceController::class, 'store'])
    ->middleware('auth')
    ->name('technical-service.store');

// ------------------ ЛК пользователя ------------------

Route::middleware(['auth', UserOnly::class])->group(function () {
    Route::get('/profile', function (Request $request) {
        $user = $request->user();

        // список дилеров (для select в Profile.jsx)
        $dealers = Dealers::select('id', 'name', 'city_name')->get();

        // прошлые/будущие записи клиента (Profile.jsx ждёт s.dealer.name)
        $services = TechnicalService::with('dealers')
            ->where('client_id', $user->id)
            ->orderByDesc('date_service')
            ->orderByDesc('time_service')
            ->whereHas('dealers')
            ->get();

        return Inertia::render('Profile', [
            'user'     => $user,
            'dealers'  => $dealers,
            'services' => $services,
        ]);
    })->name('profile');
});

Route::get('/api/technical-service/dealer/{dealer}', [TechnicalServiceController::class, 'getDealerServices']);

// ------------------ Добавление авто дилером ------------------

Route::post('/dealer/cars', [ProjectController::class, 'carStore'])
    ->name('dealer.cars.store');

Route::patch('/api/technical-service/{service}/status', [TechnicalServiceController::class, 'updateStatus'])
    ->middleware('auth');

Route::delete('/api/technical-service/{service}', [TechnicalServiceController::class, 'destroy'])
    ->middleware('auth');
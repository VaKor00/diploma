<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Cars;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->validate([
            'login'    => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        if (!Auth::attempt(['login' => $data['login'], 'password' => $data['password']])) {
            return back()->withErrors([
                'login' => 'Неверный логин или пароль',
            ])->onlyInput('login');
        }

        $request->session()->regenerate();

        $user = Auth::user();

        // type = 0 → редактор, type = 1 → дилер
        if ((int)$user->type === 1) {
            return redirect()->route('dealerpanel');
        }

        if ((int)$user->type === 0) {
            return redirect()->route('editor');
        }

        if ((int)$user->type === 2) {
            return redirect('/');
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'login' => ['required', 'string'],
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        // Проверяем, есть ли такой VIN в таблице Cars и статус = 2
        $car = Cars::where('VIN', $validated['login'])
            ->where('status', 2)
            ->first();

        if (!$car) {
            return back()->withErrors([
                'login' => 'Регистрация возможна только для проданных авто с корректным VIN.',
            ])->withInput();
        }

        // Дополнительно: запретить повторную регистрацию по одному VIN
        if (User::where('login', $validated['login'])->exists()) {
            return back()->withErrors([
                'login' => 'Пользователь с этим VIN уже зарегистрирован.',
            ])->withInput();
        }

        $user = User::create([
            'login' => $validated['login'],  // логин = VIN
            'password' => Hash::make($validated['password']),
            // при необходимости можно сохранить связь с авто
            'car_id' => $car->id ?? null,
            'type'     => 2,
            'first_name' => $validated['first_name'],  // имя
            'last_name' => $validated['last_name']  // фамилия
        ]);

        // авторизуем
        auth()->login($user);

        return redirect('/');
    }
}
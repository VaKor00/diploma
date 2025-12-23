<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $login    = 'admin';
        $password = '2025AdminheLLoCars2025';

        // ВАЖНО: сохраняем результат в $existing
        // И используем правильное имя таблицы: 'users'
        $existing = DB::table('users')->where('login', $login)->first();

        if (!$existing) {
            DB::table('users')->insert([
                'type'       => 0,                // 0 - админ
                'login'      => $login,
                'password'   => Hash::make($password),
                'first_name' => 'Администратор',
                'last_name'  => '!',
            ]);
        }
    }
}
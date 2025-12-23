<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AppServiceProvider extends ServiceProvider
{
   public function boot(): void
    {
        Inertia::share([
            'auth' => function () {
                $user = Auth::user();

                if (!$user) {
                    return null;
                }

                return [
                    'id'        => $user->id,
                    'type'      => (int) $user->type,      // 0 = админ, 1 = дилер, 2 = клиент
                    'firstName' => $user->first_name,
                    'lastName'  => $user->last_name,
                    'dealer_id' => $user->dealer_id,
                ];
            },
        ]);
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPanelController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->dealer_id) {
            abort(403, 'Пользователь не привязан к дилеру');
        }

        return Inertia::render('Dealerpanel', [
            'dealerId'   => $user->dealer_id,
            'dealerName' => $user->first_name, // если хочешь имя дилера в шапке
        ]);
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:64'],
            'phone'   => ['required', 'string'],
            'vin_car' => ['required', 'string'],
        ]);

        $client = Clients::create($validated);

        return response()->json([
            'message' => 'Заявка успешно отправлена',
            'data'    => $client,
        ], 201);
    }
}
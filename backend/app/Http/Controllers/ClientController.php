<?php

namespace App\Http\Controllers;

use App\Models\Clients;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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

        $updated = DB::table('Cars')
        ->where('vin', $validated['vin_car'])   // или другое поле VIN в таблице cars
        ->where('status', 0)                   // только свободные
        ->update(['status' => 1]);             // ставим "забронирована"

        // $updated = количество обновлённых строк (0 или 1)

        return response()->json([
            'message' => $updated
                ? 'Заявка успешно отправлена, машина забронирована'
                : 'Заявка успешно отправлена, но машина с таким VIN и статусом 0 не найдена',
            'data'    => $client,
        ], 201);
    }
}
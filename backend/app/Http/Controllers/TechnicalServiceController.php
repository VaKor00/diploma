<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TechnicalService;
use App\Models\Dealers;
use Carbon\Carbon;

class TechnicalServiceController extends Controller
{
    /**
     * Возвращает свободные временные слоты для ТО
     * GET /api/technical-service/slots?dealer_id=...&date_service=YYYY-MM-DD
     */
    

    public function getAvailableSlots(Request $request)
    {
        $request->validate([
            'dealer_id'    => 'required|integer|exists:dealers,id',
            'date_service' => 'required|date_format:Y-m-d',
        ]);

        $dealerId = $request->dealer_id;
        $date     = $request->date_service;

        // найдём дилера, чтобы использовать его часы работы / таймзону при необходимости
        $dealer = Dealers::findOrFail($dealerId);

        // базово: считаем, что работаем, например, с 09:00 до 18:00 с шагом 1 час
        // при желании можно использовать $dealer->open и $dealer->closed
        $startTime = '09:00';
        $endTime   = '18:00';
        $stepMin   = 60;

        $slots = [];
        $current = Carbon::parse($date . ' ' . $startTime);
        $end     = Carbon::parse($date . ' ' . $endTime);

        while ($current < $end) {
            $slots[] = $current->format('H:i');
            $current->addMinutes($stepMin);
        }

        // вытащим уже занятые времена для этого дилера на указанную дату
        $taken = TechnicalService::where('dealer_id', $dealerId)
            ->where('date_service', $date)
            ->pluck('time_service')
            ->toArray();

        // фильтруем свободные слоты
        $freeSlots = array_values(array_filter($slots, function ($time) use ($taken) {
            return !in_array($time, $taken);
        }));

        return response()->json([
            'slots' => $freeSlots,
        ]);
    }

    /**
     * Создаёт запись на ТО
     * POST /technical-service
     * поля: dealer_id, date_service, time_service
     */
    public function store(Request $request)
    {
        $user = $request->user(); // клиент

        $request->validate([
            'dealer_id'    => 'required|integer|exists:dealers,id',
            'date_service' => 'required|date_format:Y-m-d|after:today',
            'time_service' => 'required|date_format:H:i',
        ]);

        $dealerId = $request->dealer_id;
        $date     = $request->date_service;
        $time     = $request->time_service;

        // Проверка на занятость выбранного слота
        $exists = TechnicalService::where('dealer_id', $dealerId)
            ->where('date_service', $date)
            ->where('time_service', $time)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'time_service' => 'Выбранное время уже занято.',
            ])->withInput();
        }

        // создаём запись
        TechnicalService::create([
            'dealer_id'    => $dealerId,
            'client_id'    => $user->id,
            'modelcar_id'  => null,             // если нужно — подставь реальное значение
            'vin'          => $user->login ?? null, // или другое поле, если VIN хранится отдельно
            'date_service' => $date,
            'time_service' => $time,
            'status_ts'    => 1,           // статус по умолчанию
        ]);

        return redirect()->route('profile')
            ->with('success', 'Запись на ТО успешно создана.');
    }

    public function getDealerServices($dealerId)
        {
        $services = TechnicalService::where('dealer_id', $dealerId)
        ->whereBetween('status_ts', [1, 3])          // <-- только статусы 1–3
        ->orderByDesc('date_service')
        ->orderByDesc('time_service')
        ->get([
            'id',
            'dealer_id',
            'client_id',
            'modelcar_id',
            'vin',
            'date_service',
            'time_service',
            'status_ts',
        ]);

        return response()->json($services);
    }

    public function updateStatus(Request $request, TechnicalService $service)
    {
        $request->validate([
            'status_ts' => 'required|integer',
        ]);

        $newStatus = (int) $request->status_ts;

        // при необходимости можно ограничить допустимые переходы
        $service->status_ts = $newStatus;
        $service->save();

        return response()->json([
            'success' => true,
            'service' => $service,
        ]);
    }

    public function destroy(TechnicalService $service)
    {
        // логика проверки прав при необходимости (что это ТО этого дилера и т.п.)

        $service->delete();

        return response()->json([
            'success' => true,
        ]);
    }
}
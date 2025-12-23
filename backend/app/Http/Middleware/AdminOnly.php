<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminOnly
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        if (!$user || (int) $user->type !== 0) {
            // для Inertia можно вернуть 403 или редирект
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            return redirect('/');
        }

        return $next($request);
    }
}
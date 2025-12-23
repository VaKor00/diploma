<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DealerOnly
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // допускаем только type = 1
        if (!$user || (int) $user->type !== 1) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            return redirect('/');
        }

        return $next($request);
    }
}
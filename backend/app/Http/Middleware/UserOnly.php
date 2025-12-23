<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserOnly
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // допускаем только type = 2
        if (!$user || (int) $user->type !== 2) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Forbidden'], 403);
            }

            return redirect('/');
        }

        return $next($request);
    }
}
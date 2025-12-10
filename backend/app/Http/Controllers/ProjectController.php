<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Carousel;
use App\Models\Startpage;
use App\Models\Models;
use App\Models\City;
use App\Models\Dealers;
use App\Models\Condition;

class ProjectController extends Controller
{

    public function carousel()
    {
        $items = Carousel::all();
        return response()->json($items);
    }

    public function startpage()
    {
        $items = Startpage::orderBy('priority')->get();
        return response()->json($items);
    }

    public function models()
    {
        $items = Models::all();
        return response()->json($items);
    }

    public function showModel($id)
    {
        $model = Models::find($id);
        if (!$model) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($model);
    }
    
    public function city()
    {
        $items = City::orderBy('city')->get();
        
        return response()->json($items);
    }

    public function dealers()
    {
        $items = Dealers::all();
        
        return response()->json($items);
    }

    public function condition()
    {
        $items = Condition::all();
        
        return response()->json($items);
    }
}
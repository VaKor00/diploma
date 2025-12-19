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
use App\Models\Complectation;
use App\Models\Cars;
use App\Models\Colors;
use App\Models\Banks;
use Illuminate\Support\Facades\File;

class ProjectController extends Controller
{

    public function files()
    {
        // Путь к папке с файлами
        $directory = public_path('img/cars');

        // Получаем список файлов
        $files = File::files($directory);

        // Формируем массив путей или имен файлов
        $fileNames = array_map(function ($file) {
            return 'img/cars/' . $file->getFilename();
        }, $files);

        return response()->json($fileNames);
    }

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

    public function dealerID($id)
    {
        $dlr = Dealers::find($id);
        if (!$dlr) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($dlr);
    }

    public function condition()
    {
        $items = Condition::all();
        
        return response()->json($items);
    }

    public function complectation()
    {
        $items = Complectation::all();
        
        return response()->json($items);
    }

    public function cars()
    {
        $items = Cars::all();
        
        return response()->json($items);
    }

    public function showCar($id)
    {
        $car = Cars::find($id);
        if (!$car) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json($car);
    }

    public function colors()
    {
        $items = Colors::all();
        
        return response()->json($items);
    }

    public function banks()
    {
        $items = Banks::all();
        
        return response()->json($items);
    }
}
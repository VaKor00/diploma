<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Carousel;
use App\Models\Startpage;
use App\Models\Models;
use App\Models\City;
use App\Models\Dealers;
use App\Models\User;
use App\Models\Condition;
use App\Models\Complectation;
use App\Models\Cars;
use App\Models\Colors;
use App\Models\Banks;
use App\Models\Clients;
use App\Models\Sales;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Hash;

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

    public function cars(Request $request)
    {
        $query = Cars::query();

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        return $query->get();
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

    public function clients()
    {
        $items = Clients::all();
        
        return response()->json($items);
    }

    public function carouselStore(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'descript'  => ['nullable', 'string'],
            'button'  => ['nullable', 'string', 'max:255'],
            'link'         => ['nullable', 'string', 'max:255'],
            'img'        => ['required', 'image', 'max:5120'], // до 5 МБ
        ]);

        /** @var \Illuminate\Http\UploadedFile $image */
        $image = $request->file('img');

        // генерируем уникальное имя
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        // сохраняем в public/img/start
        $image->move(public_path('img/start'), $filename);

        // ссылка, которая будет храниться в БД и использоваться на фронте
        $imgPath = '/img/start/' . $filename;

        // сохраняем запись в БД
        $id = DB::table('carousel')->insertGetId([
            'name'       => $data['name'],
            'descript' => $data['descript'] ?? null,
            'button' => $data['button'] ?? null,
            'link'        => $data['link'] ?? null,
            'img'         => $imgPath,
        ]);

        $slide = DB::table('carousel')->where('id', $id)->first();

        return response()->json($slide, 201);
    }

    public function carouselUpdate(Request $request, $id)
    {
        // ищем запись
        $slide = DB::table('carousel')->where('id', $id)->first();
        if (!$slide) {
            return response()->json(['message' => 'Слайд не найден'], 404);
        }

        // валидация: для редактирования делаем поля необязательными (nullable)
        $data = $request->validate([
            'name'     => ['nullable', 'string', 'max:255'],
            'descript' => ['nullable', 'string'],
            'button'   => ['nullable', 'string', 'max:255'],
            'link'     => ['nullable', 'string', 'max:255'],
            'img'      => ['nullable', 'image', 'max:5120'], // новое изображение
        ]);

        $update = [];

        if (array_key_exists('name', $data)) {
            $update['name'] = $data['name'];
        }
        if (array_key_exists('descript', $data)) {
            $update['descript'] = $data['descript'];
        }
        if (array_key_exists('button', $data)) {
            $update['button'] = $data['button'];
        }
        if (array_key_exists('link', $data)) {
            $update['link'] = $data['link'];
        }

        // если пришёл новый файл — сохраняем и обновляем img
        if ($request->hasFile('img')) {
            $image = $request->file('img');

            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('img/start'), $filename);

            $imgPath = '/img/start/' . $filename;
            $update['img'] = $imgPath;
        }

        if (!empty($update)) {
            DB::table('carousel')->where('id', $id)->update($update);
        }

        $updatedSlide = DB::table('carousel')->where('id', $id)->first();

        return response()->json($updatedSlide);
    }
    
    public function destroy($id)
    {
        $slide = Carousel::findOrFail($id);
        $slide->delete();

        return response()->json(['success' => true]);
    }

    public function swapPriority(Request $request)
    {
        $id1 = $request->input('id1');
        $id2 = $request->input('id2');

        $row1 = Startpage::find($id1);
        $row2 = Startpage::find($id2);

        if (!$row1 || !$row2) {
            return response()->json(['message' => 'Одна из записей не найдена'], 404);
        }

        $p1 = (int) $row1->priority;
        $p2 = (int) $row2->priority;

        DB::table('startpage')->where('id', $id1)->update(['priority' => $p2]);
        DB::table('startpage')->where('id', $id2)->update(['priority' => $p1]);

        $row1 = Startpage::find($id1);
        $row2 = Startpage::find($id2);

        return response()->json([
            'row1' => $row1,
            'row2' => $row2,
        ]);
    }
    
    public function startpageStore(Request $request)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'edit_content'  => ['required', 'integer'],
            'desc'  => ['nullable', 'string', 'max:2550'],
            'button_bool'  => ['nullable', 'integer'],
            'button'  => ['nullable', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:255'],
            'img' => ['nullable', 'image', 'max:5120'], // до 5 МБ
        ]);

        $imgPath = null;

        if ($request->hasFile('img')) {
            /** @var \Illuminate\Http\UploadedFile $image */
            $image = $request->file('img');

            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('img/startpage'), $filename);

            $imgPath = '/img/startpage/' . $filename;
        }

        // приоритет

        $maxPriority = DB::table('startpage')->max('priority');
        $nextPriority = $maxPriority !== null ? $maxPriority + 1 : 1;

        // сохраняем запись в БД
        $id = DB::table('startpage')->insertGetId([
            'name'       => $data['name'],
            'edit_content' => $data['edit_content'] ?? null,
            'desc' => $data['desc'] ?? null,
            'button_bool' => $data['button_bool'] ?? null,
            'button' => $data['button'] ?? null,
            'link'        => $data['link'] ?? null,
            'img'         => $imgPath,
            'priority'     => $nextPriority,
        ]);

        $slide = DB::table('startpage')->where('id', $id)->first();

        return response()->json($slide, 201);
    }

    public function startpageUpdate(Request $request, $id)
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'edit_content'  => ['required', 'integer'],
            'desc'  => ['nullable', 'string', 'max:2550'],
            'button_bool'  => ['nullable', 'integer'],
            'button'  => ['nullable', 'string', 'max:255'],
            'link' => ['nullable', 'string', 'max:255'],
            'img' => ['nullable', 'image', 'max:5120'], // до 5 МБ
        ]);

        $slide = DB::table('startpage')->where('id', $id)->first();
        if (!$slide) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $updateData = [
            'name'         => $data['name'],
            'edit_content' => $data['edit_content'],
            'desc'         => $data['desc'] ?? null,
            'button_bool'  => $data['button_bool'] ?? null,
            'button'       => $data['button'] ?? null,
            'link'         => $data['link'] ?? null,
        ];

        // если пришёл новый файл - меняем картинку
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('img/startpage'), $filename);
            $imgPath = '/img/startpage/' . $filename;
            $updateData['img'] = $imgPath;
        }

        DB::table('startpage')->where('id', $id)->update($updateData);

        $updated = DB::table('startpage')->where('id', $id)->first();

        return response()->json($updated);
    }

    protected function resequencePriorities(): void
    {
        DB::transaction(function () {
            $slides = DB::table('startpage')
                ->orderBy('priority')
                ->orderBy('id')
                ->get();

            $i = 1;
            foreach ($slides as $s) {
                DB::table('startpage')
                    ->where('id', $s->id)
                    ->update(['priority' => $i]);
                $i++;
            }
        });
    }

    public function startpagedel($id)
    {
        DB::table('startpage')->where('id', $id)->delete();

        $this->resequencePriorities();

        return response()->json(['success' => true]);
    }

     public function conditionStore(Request $request)
    {
        $data = $request->validate([
            'condition'        => ['required', 'string', 'max:2550'],
        ]);

        // сохраняем запись в БД
        $id = DB::table('condition')->insertGetId([
            'condition'       => $data['condition'],
        ]);

        $slide = DB::table('condition')->where('id', $id)->first();

        return response()->json($slide, 201);
    }

    public function conditionUpdate(Request $request, $id)
    {
        // ищем запись
        $slide = DB::table('condition')->where('id', $id)->first();
        if (!$slide) {
            return response()->json(['message' => 'Слайд не найден'], 404);
        }

        // валидация: для редактирования делаем поля необязательными (nullable)
        $data = $request->validate([
            'condition'     => ['required', 'string', 'max:2550'],
        ]);

        $update = [];

        if (array_key_exists('condition', $data)) {
            $update['condition'] = $data['condition'];
        }
        if (!empty($update)) {
            DB::table('condition')->where('id', $id)->update($update);
        }

        $updatedSlide = DB::table('condition')->where('id', $id)->first();

        return response()->json($updatedSlide);
    }
    
    public function conditionDel($id)
    {
        $slide = Condition::findOrFail($id);
        $slide->delete();

        return response()->json(['success' => true]);
    }

    public function cityStore(Request $request)
    {
        $data = $request->validate([
            'city'        => ['required', 'string', 'max:255'],
        ]);

        // сохраняем запись в БД
        $id = DB::table('city')->insertGetId([
            'city'       => $data['city'],
        ]);

        $slide = DB::table('city')->where('id', $id)->first();

        return response()->json($slide, 201);
    }
    
    public function cityDel($id)
    {
        $slide = City::findOrFail($id);
        $slide->delete();

        return response()->json(['success' => true]);
    }

    // дилер

    public function dealersStore(Request $request)
    {
         $data = $request->validate([
            'city'     => ['required', 'integer'],
            'city_name'     => ['required', 'string', 'max:255'],
            'street'     => ['required', 'string', 'max:255'],
            'home'     => ['required', 'string', 'max:255'],
            'name'     => ['required', 'string', 'max:255'],
            'open'     => ['required', 'date_format:H:i'],
            'closed'     => ['required', 'date_format:H:i'],
            'timezone'     => ['required', 'string', 'max:255'],
            'phone'     => ['required', 'string', 'max:15'],
            'coord_x'     => ['required', 'numeric'],
            'coord_y'     => ['required', 'numeric'],
        ]);

        // сохраняем запись в БД
        $id = DB::table('dealers')->insertGetId([
            'city'       => $data['city'],
            'city_name'       => $data['city_name'],
            'street'       => $data['street'],
            'home'       => $data['home'],
            'name'       => $data['name'],
            'open'       => $data['open'],
            'closed'       => $data['closed'],
            'timezone'       => $data['timezone'],
            'phone'       => $data['phone'],
            'coord_x'       => $data['coord_x'],
            'coord_y'       => $data['coord_y'],
            'login'       => 0,
        ]);

        $slide = DB::table('condition')->where('id', $id)->first();

        return response()->json($slide, 201);
    }

    public function dealersUpdate(Request $request, $id)
    {
        $slide = DB::table('dealers')->where('id', $id)->first();
        if (!$slide) {
            return response()->json(['message' => 'Дилер не найден'], 404);
        }

        $data = $request->validate([
            'city'      => ['required', 'integer'],
            'city_name' => ['required', 'string', 'max:255'],
            'street'    => ['required', 'string', 'max:255'],
            'home'      => ['required', 'string', 'max:255'],
            'name'      => ['required', 'string', 'max:255'],
            'open'      => ['required', 'date_format:H:i'],
            'closed'    => ['required', 'date_format:H:i'],
            'timezone'  => ['required', 'string', 'max:255'],
            'phone'     => ['required', 'string', 'max:15'],
            'coord_x'   => ['required', 'numeric'],
            'coord_y'   => ['required', 'numeric'],
        ]);

        $update = [
            'city'      => $data['city'],
            'city_name' => $data['city_name'],
            'street'    => $data['street'],
            'home'      => $data['home'],
            'name'      => $data['name'],
            'open'      => $data['open'],
            'closed'    => $data['closed'],
            'timezone'  => $data['timezone'],
            'phone'     => $data['phone'],
            'coord_x'   => $data['coord_x'],
            'coord_y'   => $data['coord_y'],
        ];

        DB::table('dealers')->where('id', $id)->update($update);

        $updatedSlide = DB::table('dealers')->where('id', $id)->first();

        return response()->json($updatedSlide);
    }
    
    public function dealersDel($id)
    {
        $slide = Dealers::findOrFail($id);
        $slide->delete();

        return response()->json(['success' => true]);
    }

    // добавление модели

    public function modelStore(Request $request)
    {
        $data = $request->validate([
            'model_name' => ['required', 'string', 'max:255'],
            'length'  => ['required', 'integer'],
            'width'  => ['required', 'integer'],
            'height'  => ['required', 'integer'],
            'whellbase'  => ['required', 'integer'],
            'clearance'  => ['required', 'integer'],
            'trunk'  => ['required', 'integer'],
            'fuel_tank'  => ['required', 'integer'],
            'engine_m'  => ['required', 'integer'],
            'min_price'  => ['required', 'integer'],
            'description' => ['required', 'string', 'max:1550'],
            'description_full' => ['required', 'string', 'max:2550'],
            'features' => ['required', 'string', 'max:4255'],
            'img'        => ['required', 'image', 'max:15120'], 
            'salon_photo'        => ['required', 'image', 'max:15120'],
        ]);

        // изображение машины

        /** @var \Illuminate\Http\UploadedFile $image */
        $image = $request->file('img');

        // генерируем уникальное имя
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();

        // сохраняем в public/img/start
        $image->move(public_path('img/cars'), $filename);

        // ссылка, которая будет храниться в БД и использоваться на фронте
        $imgPath = '/img/cars/' . $filename;

        // изображение салона

        /** @var \Illuminate\Http\UploadedFile $image */
        $image1 = $request->file('salon_photo');

        // генерируем уникальное имя
        $filename1 = time() . '_' . uniqid() . '.' . $image1->getClientOriginalExtension();

        // сохраняем в public/img/start
        $image1->move(public_path('img/cars'), $filename1);

        // ссылка, которая будет храниться в БД и использоваться на фронте
        $imgPath1 = '/img/cars/' . $filename1;

        // сохраняем запись в БД
        $id = DB::table('models')->insertGetId([
            'model_name'       => $data['model_name'],
            'length' => $data['length'],
            'width' => $data['width'],
            'height' => $data['height'],
            'whellbase' => $data['whellbase'],
            'clearance' => $data['clearance'],
            'trunk' => $data['trunk'],
            'fuel_tank' => $data['fuel_tank'],
            'engine_m' => $data['engine_m'],
            'min_price' => $data['min_price'],
            'description' => $data['description'],
            'description_full' => $data['description_full'],
            'features' => $data['features'],
            'img'         => $imgPath,
            'salon_photo' => $imgPath1,
        ]);

        $slide = DB::table('models')->where('id', $id)->first();

        return response()->json($slide, 201);
    }

   public function modelUpdate(Request $request, $id)
    {
        // Проверяем, есть ли запись
        $slide = DB::table('models')->where('id', $id)->first();
        if (!$slide) {
            return response()->json(['message' => 'Модель не найдена'], 404);
        }

        // Валидация. Картинки делаем необязательными (nullable)
        $data = $request->validate([
            'model_name'        => ['required', 'string', 'max:255'],
            'length'            => ['required', 'integer'],
            'width'             => ['required', 'integer'],
            'height'            => ['required', 'integer'],
            'whellbase'         => ['required', 'integer'],
            'clearance'         => ['required', 'integer'],
            'trunk'             => ['required', 'integer'],
            'fuel_tank'         => ['required', 'integer'],
            'engine_m'          => ['required', 'integer'],
            'min_price'         => ['required', 'integer'],
            'description'       => ['required', 'string', 'max:1550'],
            'description_full'  => ['required', 'string', 'max:2550'],
            'features'          => ['required', 'string', 'max:4255'],
            'img'               => ['nullable', 'image', 'max:15120'],
            'salon_photo'       => ['nullable', 'image', 'max:15120'],
        ]);

        // Базовый набор полей для обновления
        $update = [
            'model_name'       => $data['model_name'],
            'length'           => $data['length'],
            'width'            => $data['width'],
            'height'           => $data['height'],
            'whellbase'        => $data['whellbase'],
            'clearance'        => $data['clearance'],
            'trunk'            => $data['trunk'],
            'fuel_tank'        => $data['fuel_tank'],
            'engine_m'         => $data['engine_m'],
            'min_price'        => $data['min_price'],
            'description'      => $data['description'],
            'description_full' => $data['description_full'],
            'features'         => $data['features'],
            // img и salon_photo добавим ниже, только если придут новые файлы
        ];

        // Если пришёл новый файл модели
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('img/cars'), $filename);
            $update['img'] = '/img/cars/' . $filename;
        }

        // Если пришёл новый файл салона
        if ($request->hasFile('salon_photo')) {
            $image1 = $request->file('salon_photo');
            $filename1 = time() . '_' . uniqid() . '.' . $image1->getClientOriginalExtension();
            $image1->move(public_path('img/cars'), $filename1);
            $update['salon_photo'] = '/img/cars/' . $filename1;
        }

        // Выполняем обновление
        $rows = DB::table('models')->where('id', $id)->update($update);

        // Можно залогировать, если нужно
        // \Log::info('modelUpdate rows updated', ['id' => $id, 'rows' => $rows]);

        $updatedSlide = DB::table('models')->where('id', $id)->first();
        return response()->json($updatedSlide);
    }

    public function modelDel($id)
    {
        $slide = Models::findOrFail($id);
        $slide->delete();

        return response()->json(['success' => true]);
    }

    // добавление модели

    // добавление комплектации
   public function complectationStore(Request $request)
{
    $data = $request->validate([
        'model_id'                   => ['required', 'integer'],
        'complectation_name'         => ['required', 'string', 'max:255'],
        'price'                      => ['required', 'integer'],
        'engine'                     => ['required', 'integer'],
        'track_fuel'                 => ['required', 'numeric'],
        'city_fuel'                  => ['required', 'numeric'],
        'transmission'               => ['required', 'string', 'max:255'],
        'brakes'                     => ['required', 'string', 'max:255'],
        'wheel_drive'                => ['required', 'string', 'max:255'],
        'weight'                     => ['required', 'integer'],
        'headlights'                 => ['required', 'string', 'max:255'],
        'hatch'                      => ['required', 'integer'],
        'tinting'                    => ['required', 'integer'],
        'airbag'                     => ['required', 'integer'],
        'heated_front_seats'         => ['required', 'integer'],
        'heated_rear_seats'          => ['required', 'integer'],
        'salon'                      => ['required', 'string'],
        'seats'                      => ['required', 'string'],
        'conditions'                 => ['required', 'integer'],
        'cruise_control'             => ['required', 'integer'],
        'apple_carplay_android_auto' => ['required', 'integer'],
        'audio_speakers'             => ['required', 'integer'],
        'usb'                        => ['required', 'integer'],
    ]);

    $id = DB::table('complectation')->insertGetId([
        'model_id'                   => $data['model_id'],
        'complectation_name'         => $data['complectation_name'],
        'price'                      => $data['price'],
        'engine'                     => $data['engine'],
        'track_fuel'                 => $data['track_fuel'],
        'city_fuel'                  => $data['city_fuel'],
        'transmission'               => $data['transmission'],
        'brakes'                     => $data['brakes'],
        'wheel_drive'                => $data['wheel_drive'],
        'weight'                     => $data['weight'],
        'headlights'                 => $data['headlights'],
        'hatch'                      => $data['hatch'],
        'tinting'                    => $data['tinting'],
        'airbag'                     => $data['airbag'],
        'heated_front_seats'         => $data['heated_front_seats'],
        'heated_rear_seats'          => $data['heated_rear_seats'],
        'salon'                      => $data['salon'],
        'seats'                      => $data['seats'],
        'conditions'                 => $data['conditions'],
        'cruise_control'             => $data['cruise_control'],
        'apple_carplay_android_auto' => $data['apple_carplay_android_auto'],
        'audio_speakers'             => $data['audio_speakers'],
        'usb'                        => $data['usb'],
    ]);

    // 2. Считаем минимальную цену по этой модели
    $minPrice = DB::table('complectation')
        ->where('model_id', $data['model_id'])
        ->min('price');

    // 3. Обновляем таблицу моделей (поставь свои названия таблицы/колонки)
    DB::table('Models')
        ->where('id', $data['model_id'])
        ->update(['min_price' => $minPrice]);

    // 4. Отдаём созданную комплектацию
    $row = DB::table('complectation')->where('id', $id)->first();

    // ВАЖНО: статус 201
    return response()->json($row, 201);
    }

   public function complectationUpdate(Request $request, $id)
{
    try {
        // Посмотреть, что реально приходит
        // \Log::info('Update request', $request->all());

        $data = $request->validate([
            'model_id'                   => ['required', 'integer'],
            'complectation_name'         => ['required', 'string', 'max:255'],
            'price'                      => ['required', 'integer'],
            'engine'                     => ['required', 'integer'],
            'track_fuel'                 => ['required', 'numeric'],
            'city_fuel'                  => ['required', 'numeric'],
            'transmission'               => ['required', 'string', 'max:255'],
            'brakes'                     => ['required', 'string', 'max:255'],
            'wheel_drive'                => ['required', 'string', 'max:255'],
            'weight'                     => ['required', 'integer'],
            'headlights'                 => ['required', 'string', 'max:255'],
            'hatch'                      => ['required', 'integer'],
            'tinting'                    => ['required', 'integer'],
            'airbag'                     => ['required', 'integer'],
            'heated_front_seats'         => ['required', 'integer'],
            'heated_rear_seats'          => ['required', 'integer'],
            'salon'                      => ['required', 'string'],
            'seats'                      => ['required', 'string'],
            'conditions'                 => ['required', 'integer'],
            'cruise_control'             => ['required', 'integer'],
            'apple_carplay_android_auto' => ['required', 'integer'],
            'audio_speakers'             => ['required', 'integer'],
            'usb'                        => ['required', 'integer'],
        ]);

        $row = DB::table('complectation')->where('id', $id)->first();
        if (!$row) {
            return response()->json(['message' => 'complectation not found'], 404);
        }

        DB::table('complectation')->where('id', $id)->update([
            'model_id'                   => $data['model_id'],
            'complectation_name'         => $data['complectation_name'],
            'price'                      => $data['price'],
            'engine'                     => $data['engine'],
            'track_fuel'                 => $data['track_fuel'],
            'city_fuel'                  => $data['city_fuel'],
            'transmission'               => $data['transmission'],
            'brakes'                     => $data['brakes'],
            'wheel_drive'                => $data['wheel_drive'],
            'weight'                     => $data['weight'],
            'headlights'                 => $data['headlights'],
            'hatch'                      => $data['hatch'],
            'tinting'                    => $data['tinting'],
            'airbag'                     => $data['airbag'],
            'heated_front_seats'         => $data['heated_front_seats'],
            'heated_rear_seats'          => $data['heated_rear_seats'],
            'salon'                      => $data['salon'],
            'seats'                      => $data['seats'],
            'conditions'                 => $data['conditions'],
            'cruise_control'             => $data['cruise_control'],
            'apple_carplay_android_auto' => $data['apple_carplay_android_auto'],
            'audio_speakers'             => $data['audio_speakers'],
            'usb'                        => $data['usb'],
        ]);

        $minPrice = DB::table('complectation')
            ->where('model_id', $data['model_id'])
            ->min('price');

        DB::table('Models')
            ->where('id', $data['model_id'])
            ->update(['min_price' => $minPrice]);

        $updated = DB::table('complectation')->where('id', $id)->first();

        return response()->json($updated, 200);
    } catch (\Throwable $e) {
        \Log::error('complectationUpdate error: '.$e->getMessage(), [
            'trace' => $e->getTraceAsString(),
        ]);
        return response()->json(['message' => 'Server error'], 500);
    }
}

    public function complectationDel($id)
    {
        $slide = Complectation::findOrFail($id);
        $modelId = $slide->model_id;

        $slide->delete();

        // Пересчитываем min_price для этой модели
        $minPrice = DB::table('complectation')
            ->where('model_id', $modelId)
            ->min('price'); // вернёт null, если комплектаций больше нет

        // Обновляем запись модели
        DB::table('models') 
            ->where('id', $modelId)
            ->update(['min_price' => $minPrice]);

        return response()->json(['success' => true]);
    }

    public function storeClr(Request $request)
        {
            $data = $request->validate([
                'color_name' => ['required', 'string', 'max:255'],
                'color_code' => ['required', 'string', 'max:20'],
            ]);

            $color = Colors::create($data);

            // статус 201 — создано
            return response()->json($color, 201);
        }

    public function updateClr(Request $request, $id)
        {
            $color = Colors::findOrFail($id);

            $data = $request->validate([
                'color_name' => ['required', 'string', 'max:255'],
                'color_code' => ['required', 'string', 'max:20'],
            ]);

            $color->update($data);

            return response()->json($color, 200);
        }

    public function destroyClr($id)
        {
            $color = Colors::findOrFail($id);

            $color->delete();

            return response()->json(['success' => true], 200);
        }

    // создание

    
    public function storeBank(Request $request)
    {
        try {
            $data = $request->validate([
                'name'        => ['required', 'string', 'max:255'],
                'deposit_min' => ['required', 'integer'],
                'min_percent' => ['required', 'integer'],
                'max_percent' => ['required', 'integer'],
                'min_month'   => ['required', 'integer'],
                'max_month'   => ['required', 'integer'],
                'logo'        => ['required', 'image', 'max:2048'],
            ]);

            $logoPath = null;

            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();

                // папка public/img/banks у тебя уже есть
                $file->move(public_path('img/banks'), $filename);

                $logoPath = '/img/banks/' . $filename;
            }

            // ВАЖНО: никаких created_at / updated_at, только реальные поля таблицы
            $id = DB::table('banks')->insertGetId([
                'name'        => $data['name'],
                'logo'        => $logoPath,
                'deposit_min' => $data['deposit_min'],
                'min_percent' => $data['min_percent'],
                'max_percent' => $data['max_percent'],
                'min_month'   => $data['min_month'],
                'max_month'   => $data['max_month'],
            ]);

            $bank = DB::table('banks')->where('id', $id)->first();

            return response()->json($bank, 201);
        } catch (\Throwable $e) {
            Log::error('Bank store error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            // На время отладки возвращаем текст ошибки, чтобы видеть её на фронте
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateBank(Request $request, $id)
    {
        try {
            $bank = DB::table('banks')->where('id', $id)->first();
            if (!$bank) {
                return response()->json(['message' => 'Bank not found'], 404);
            }

            $data = $request->validate([
                'name'        => ['required', 'string', 'max:255'],
                'deposit_min' => ['required', 'integer'],
                'min_percent' => ['required', 'integer'],
                'max_percent' => ['required', 'integer'],
                'min_month'   => ['required', 'integer'],
                'max_month'   => ['required', 'integer'],
                // логотип при редактировании делаем необязательным
                'logo'        => ['sometimes', 'nullable', 'image', 'max:2048'],
            ]);

            $logoPath = $bank->logo;

            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('img/banks'), $filename);
                $logoPath = '/img/banks/' . $filename;
            }

            DB::table('banks')
                ->where('id', $id)
                ->update([
                    'name'        => $data['name'],
                    'logo'        => $logoPath,
                    'deposit_min' => $data['deposit_min'],
                    'min_percent' => $data['min_percent'],
                    'max_percent' => $data['max_percent'],
                    'min_month'   => $data['min_month'],
                    'max_month'   => $data['max_month'],
                ]);

            $updated = DB::table('banks')->where('id', $id)->first();

            return response()->json($updated, 200);
        } catch (\Throwable $e) {
            Log::error('Bank update error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
   
    public function destroyBank($id)
    {
        try {
            $bank = DB::table('banks')->where('id', $id)->first();
            if (!$bank) {
                return response()->json(['message' => 'Bank not found'], 404);
            }

            // При желании можешь удалять файл логотипа
            // if ($bank->logo && file_exists(public_path($bank->logo))) {
            //     @unlink(public_path($bank->logo));
            // }

            DB::table('banks')->where('id', $id)->delete();

            return response()->json(['success' => true], 200);
        } catch (\Throwable $e) {
            Log::error('Bank destroy error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
        
    // добавить авто на продажу

    public function carStore(Request $request)
    {
        // $user = Auth::user();
            $validated = $request->validate([
                'model_id'         => ['required', 'integer'],
                'complectation_id' => ['required', 'integer'],
                'color_id'         => ['required', 'integer'],
                'vin'              => ['required', 'string', 'max:255'],
                'dealer_id'        => ['required', 'integer'],
                'price'            => ['required', 'integer'],
                'img_1'            => ['required', 'image', 'max:5120'],
                'img_2'            => ['nullable', 'image', 'max:5120'],
                'img_3'            => ['nullable', 'image', 'max:5120'],
                'img_4'            => ['nullable', 'image', 'max:5120'],
                'img_5'            => ['nullable', 'image', 'max:5120'],
            ]);

            foreach (['img_1', 'img_2', 'img_3', 'img_4', 'img_5'] as $field) {
                if ($request->hasFile($field)) {
                    $file = $request->file($field);
                    $filename = uniqid() . '.' . $file->getClientOriginalExtension();
                    // путь относительно public
                    $file->move(public_path('img/cars'), $filename);

                    // в БД можно хранить либо 'img/cars/xxx.jpg', либо только имя
                    $paths[$field] = '/img/cars/' . $filename;
                } else {
                    $paths[$field] = '';
                }
            }

            Cars::create([
                'model_id'         => $validated['model_id'],
                'complectation_id' => $validated['complectation_id'],
                'color_id'         => $validated['color_id'],
                'vin'              => $validated['vin'],
                'dealer_id'        => $validated['dealer_id'],
                'img_1'            => $paths['img_1'],
                'img_2'            => $paths['img_2'],
                'img_3'            => $paths['img_3'],
                'img_4'            => $paths['img_4'],
                'img_5'            => $paths['img_5'],
                'price'            => $validated['price'],
                'status'           => 0,
            ]);

            return response()->json(['message' => 'ok'], 201);
        }

    
    public function storeLg(Request $request, Dealers $dealer)
    {
        
        $data = $request->validate([
            'login'    => ['required', 'string', 'max:255', 'unique:users,login'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        // создаём пользователя-дилера
        $user = User::create([
            'first_name' => $dealer->name,  // название дилера
            'last_name'  => ' ',            // как ты писал
            'type'       => 1,              // 1 = дилер
            'login'      => $data['login'],
            'password'   => Hash::make($data['password']),
            'dealer_id'  => $dealer->id,
        ]);

        // в таблице Dealers отмечаем, что логин есть
        $dealer->login = 1;
        $dealer->save();

        return response()->json([
            'message' => 'Учётная запись дилера создана',
            'user'    => $user,
            'dealer'  => $dealer,
        ], 201);
    }

    // PUT /api/dealers/{dealer}/password
    public function updatePassword(Request $request, Dealers $dealer)
    {
        $data = $request->validate([
            'password' => ['required', 'string', 'min:6'],
        ]);

        // ищем пользователя, привязанного к этому дилеру
        $user = User::where('dealer_id', $dealer->id)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Для этого дилера ещё не создан пользователь.',
            ], 404);
        }

        $user->password = Hash::make($data['password']);
        $user->save();

        return response()->json([
            'message' => 'Пароль обновлён',
        ]);
    }

        // просто снять бронь
        public function destroyCli($id)
        {
            $client = Clients::findOrFail($id);

            $vin = $client->vin_car;

            if ($vin) {
                $car = Cars::where('vin', $vin)->first();

                if ($car) {
                    $car->status = 0;
                    $car->save();
                }

            }

            $client->delete();

            return response()->json(['success' => true]);
        }

        // продажа авто
        public function saleCli($id)
        {
            // 1. Находим клиента
            $client = Clients::findOrFail($id);
            $vin = $client->vin_car;

            if ($vin) {
                // 2. Находим машину по VIN
                $car = Cars::where('vin', $vin)->first();

                if ($car) {
                    // 2.1. Меняем статус машины на 2 (продана)
                    $car->status = 2;
                    $car->save();

                    // 2.2. Создаём запись в sales
                    Sales::create([
                        'client_id' => $client->id,
                        'car_id'    => $car->id,
                        'vin'       => $vin,
                        'price'     => $car->price,
                        'status'    => 0,   // учётная запись ещё не создана
                    ]);
                }
            }

            // 3. Удаляем заявку клиента
            $client->delete();

            return response()->json(['success' => true]);
        }
}
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
use Illuminate\Validation\Rule;
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
    
    private function normalizeName(string $raw, ?int $ignoreId = null): string
    {
        $value   = preg_replace('/\s+/', ' ', $raw ?? '');
        $trimmed = trim($value);

        if ($trimmed === '') {
            throw ValidationException::withMessages([
                'name' => 'Название не может быть пустым',
            ]);
        }

        // первая буква заглавная
        $first = mb_strtoupper(mb_substr($trimmed, 0, 1, 'UTF-8'), 'UTF-8');
        $rest  = mb_substr($trimmed, 1, null, 'UTF-8');

        $normalized = $first . $rest;

        // проверка уникальности в таблице startpage (без учёта регистра)
        $query = DB::table('startpage')
            ->whereRaw('LOWER(name) = ?', [mb_strtolower($normalized, 'UTF-8')]);

        if ($ignoreId !== null) {
            $query->where('id', '!=', $ignoreId);
        }

        if ($query->exists()) {
            throw ValidationException::withMessages([
                'name' => 'Элемент с таким заголовком уже существует',
            ]);
        }

        return $normalized;
    }
    
    public function startpageStore(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'edit_content' => ['required', 'integer'],
            'desc'         => ['nullable', 'string', 'max:2550'],
            'button_bool'  => ['nullable', 'integer'],
            'button'       => ['nullable', 'string', 'max:255'],
            'link'         => ['nullable', 'string', 'max:255'],
            'img'          => ['nullable', 'image', 'max:5120'],
        ]);

        // Нормализуем и сразу проверяем уникальность
        $data['name'] = $this->normalizeName($data['name'], null);

        $imgPath = null;

        if ($request->hasFile('img')) {
            /** @var \Illuminate\Http\UploadedFile $image */
            $image = $request->file('img');

            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('img/startpage'), $filename);

            $imgPath = '/img/startpage/' . $filename;
        }

        $maxPriority  = DB::table('startpage')->max('priority');
        $nextPriority = $maxPriority !== null ? $maxPriority + 1 : 1;

        $id = DB::table('startpage')->insertGetId([
            'name'        => $data['name'],
            'edit_content'=> $data['edit_content'] ?? null,
            'desc'        => $data['desc'] ?? null,
            'button_bool' => $data['button_bool'] ?? null,
            'button'      => $data['button'] ?? null,
            'link'        => $data['link'] ?? null,
            'img'         => $imgPath,
            'priority'    => $nextPriority,
        ]);

        $slide = DB::table('startpage')->where('id', $id)->first();

        return response()->json($slide, 201);
    }

    public function startpageUpdate(Request $request, $id)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'edit_content' => ['required', 'integer'],
            'desc'         => ['nullable', 'string', 'max:2550'],
            'button_bool'  => ['nullable', 'integer'],
            'button'       => ['nullable', 'string', 'max:255'],
            'link'         => ['nullable', 'string', 'max:255'],
            'img'          => ['nullable', 'image', 'max:5120'],
        ]);

        $slide = DB::table('startpage')->where('id', $id)->first();
        if (!$slide) {
            return response()->json(['message' => 'Not found'], 404);
        }

        // нормализуем и проверяем уникальность, игнорируя текущую запись
        $data['name'] = $this->normalizeName($data['name'], (int)$id);

        $updateData = [
            'name'         => $data['name'],
            'edit_content' => $data['edit_content'],
            'desc'         => $data['desc'] ?? null,
            'button_bool'  => $data['button_bool'] ?? null,
            'button'       => $data['button'] ?? null,
            'link'         => $data['link'] ?? null,
        ];

        if ($request->hasFile('img')) {
            $image    = $request->file('img');
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
            'city' => ['required', 'string', 'max:255'],
        ]);

        $city = trim($data['city']);

        // Проверка на дубликат (регистр чувствительный/нет — см. ниже)
        $exists = DB::table('city')
            ->whereRaw('LOWER(city) = LOWER(?)', [$city])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Такой город уже существует',
                'code'    => 'CITY_ALREADY_EXISTS',
            ], 409);
        }

        $id = DB::table('city')->insertGetId([
            'city' => $city,
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
            'city'      => ['required', 'integer'],
            'city_name' => ['required', 'string', 'max:255'],

            'street'    => [
                'required',
                'string',
                'max:255',
                'regex:/^(улица|проспект|переулок|бульвар|шоссе|проезд)\s+[A-ZА-ЯЁ][\pL0-9\s\-\.\,]*$/u',
            ],

            'home'      => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-ZА-ЯЁ0-9\/]+(?:\s+(?:корпус|строение)\s+[A-ZА-ЯЁ0-9\/]+)?$/u',
            ],

            'name'      => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-ZА-ЯЁ][\pL0-9\s\-\.\,]*$/u',
            ],

            'open'      => ['required', 'date_format:H:i'],
            'closed'    => ['required', 'date_format:H:i'],

            'timezone'  => ['required', 'string', 'max:255'],

            'phone'     => [
                'required',
                'string',
                'max:12',
                'regex:/^\+7[3489]\d{9}$/',
            ],

            'coord_x'   => ['required', 'numeric'],
            'coord_y'   => ['required', 'numeric'],
        ], [
            'street.regex' => 'Адрес должен начинаться со слова "улица/проспект/переулок/бульвар/шоссе/проезд" и названием с заглавной буквы.',
            'home.regex'   => 'Номер дома может содержать только заглавные буквы, цифры, "/", а также "корпус" или "строение" с номером.',
            'name.regex'   => 'Название должно начинаться с заглавной буквы.',
            'phone.regex'  => 'Телефон должен быть в формате +7XXXXXXXXXX, где после +7 цифра 3, 4, 8 или 9.',
        ]);

        // доп. проверка: время открытия < время закрытия
        if ($data['open'] >= $data['closed']) {
            return response()->json([
                'message' => 'Время открытия должно быть меньше времени закрытия.',
            ], 422);
        }

        // 1) Проверка дубля по адресу (город + улица + дом)
        $addressExists = DB::table('dealers')
            ->where('city', $data['city'])
            ->where('street', $data['street'])
            ->where('home', $data['home'])
            ->exists();

        if ($addressExists) {
            return response()->json([
                'message' => 'По этому адресу уже существует дилерский центр.',
            ], 422);
        }

        // 2) Проверка дубля по названию дилера в пределах города
        $nameExistsInCity = DB::table('dealers')
            ->where('city', $data['city'])
            ->where('name', $data['name'])
            ->exists();

        if ($nameExistsInCity) {
            return response()->json([
                'message' => 'Дилер с таким названием уже существует в этом городе.',
            ], 422);
        }

        $id = DB::table('dealers')->insertGetId([
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
            'login'     => 0,
        ]);

        $dealer = DB::table('dealers')->where('id', $id)->first();

        return response()->json($dealer, 201);
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

            'street'    => [
                'required',
                'string',
                'max:255',
                'regex:/^(улица|проспект|переулок|бульвар|шоссе|проезд)\s+[A-ZА-ЯЁ][\pL0-9\s\-\.\,]*$/u',
            ],

            'home'      => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-ZА-ЯЁ0-9\/]+(?:\s+(?:корпус|строение)\s+[A-ZА-ЯЁ0-9\/]+)?$/u',
            ],

            'name'      => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-ZА-ЯЁ][\pL0-9\s\-\.\,]*$/u',
            ],

            'open'      => ['required', 'date_format:H:i'],
            'closed'    => ['required', 'date_format:H:i'],

            'timezone'  => ['required', 'string', 'max:255'],

            'phone'     => [
                'required',
                'string',
                'max:12',
                'regex:/^\+7[3489]\d{9}$/',
            ],

            'coord_x'   => ['required', 'numeric'],
            'coord_y'   => ['required', 'numeric'],
        ], [
            'street.regex' => 'Адрес должен начинаться со слова "улица/проспект/переулок/бульвар/шоссе/проезд" и названием с заглавной буквы.',
            'home.regex'   => 'Номер дома может содержать только заглавные буквы, цифры, "/", а также "корпус" или "строение" с номером.',
            'name.regex'   => 'Название должно начинаться с заглавной буквы.',
            'phone.regex'  => 'Телефон должен быть в формате +7XXXXXXXXXX, где после +7 цифра 3, 4, 8 или 9.',
        ]);

        // доп. проверка: время открытия < время закрытия
        if ($data['open'] >= $data['closed']) {
            return response()->json([
                'message' => 'Время открытия должно быть меньше времени закрытия.',
            ], 422);
        }

        // 1) Проверка дубля по адресу (город + улица + дом), исключая текущую запись
        $addressExists = DB::table('dealers')
            ->where('city', $data['city'])
            ->where('street', $data['street'])
            ->where('home', $data['home'])
            ->where('id', '<>', $id)
            ->exists();

        if ($addressExists) {
            return response()->json([
                'message' => 'По этому адресу уже существует дилерский центр.',
            ], 422);
        }

        // 2) Проверка дубля по названию дилера в городе, исключая текущую запись
        $nameExistsInCity = DB::table('dealers')
            ->where('city', $data['city'])
            ->where('name', $data['name'])
            ->where('id', '<>', $id)
            ->exists();

        if ($nameExistsInCity) {
            return response()->json([
                'message' => 'Дилер с таким названием уже существует в этом городе.',
            ], 422);
        }

        DB::table('dealers')->where('id', $id)->update([
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
        ]);

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
            'model_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-ZА-ЯЁ][\pL0-9\s\-\.\,]*$/u',
            ],
            'length'           => ['required', 'integer'],
            'width'            => ['required', 'integer'],
            'height'           => ['required', 'integer'],
            'whellbase'        => ['required', 'integer'],
            'clearance'        => ['required', 'integer'],
            'trunk'            => ['required', 'integer'],
            'fuel_tank'        => ['required', 'integer'],
            'engine_m'         => ['required', 'integer'],
            'min_price'        => ['required', 'integer'],
            'description'      => ['required', 'string', 'max:1550'],
            'description_full' => ['required', 'string', 'max:2550'],
            'features'         => ['required', 'string', 'max:4255'],
            'img'              => ['required', 'image', 'max:15120'],
            'salon_photo'      => ['required', 'image', 'max:15120'],
        ], [
            'model_name.regex' => 'Название модели должно начинаться с заглавной буквы.',
        ]);

        // проверка дубля по названию модели
        $exists = DB::table('models')
            ->where('model_name', $data['model_name'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Модель с таким названием уже существует.',
            ], 422);
        }

        // изображение машины
        /** @var \Illuminate\Http\UploadedFile $image */
        $image = $request->file('img');
        $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('img/cars'), $filename);
        $imgPath = '/img/cars/' . $filename;

        // изображение салона
        /** @var \Illuminate\Http\UploadedFile $image1 */
        $image1 = $request->file('salon_photo');
        $filename1 = time() . '_' . uniqid() . '.' . $image1->getClientOriginalExtension();
        $image1->move(public_path('img/cars'), $filename1);
        $imgPath1 = '/img/cars/' . $filename1;

        // сохраняем запись в БД
        $id = DB::table('models')->insertGetId([
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
            'img'              => $imgPath,
            'salon_photo'      => $imgPath1,
        ]);

        $slide = DB::table('models')->where('id', $id)->first();

        return response()->json($slide, 201);
    }

   public function modelUpdate(Request $request, $id)
    {
        $slide = DB::table('models')->where('id', $id)->first();
        if (!$slide) {
            return response()->json(['message' => 'Модель не найдена'], 404);
        }

        $data = $request->validate([
            'model_name'        => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-ZА-ЯЁ][\pL0-9\s\-\.\,]*$/u',
            ],
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
        ], [
            'model_name.regex' => 'Название модели должно начинаться с заглавной буквы.',
        ]);

        // проверка дубля по названию модели, исключая текущую
        $exists = DB::table('models')
            ->where('model_name', $data['model_name'])
            ->where('id', '<>', $id)
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Модель с таким названием уже существует.',
            ], 422);
        }

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
        ];

        // новое изображение модели
        if ($request->hasFile('img')) {
            $image = $request->file('img');
            $filename = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('img/cars'), $filename);
            $update['img'] = '/img/cars/' . $filename;
        }

        // новое изображение салона
        if ($request->hasFile('salon_photo')) {
            $image1 = $request->file('salon_photo');
            $filename1 = time() . '_' . uniqid() . '.' . $image1->getClientOriginalExtension();
            $image1->move(public_path('img/cars'), $filename1);
            $update['salon_photo'] = '/img/cars/' . $filename1;
        }

        DB::table('models')->where('id', $id)->update($update);

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
    try {
        $data = $request->validate([
            'model_id'           => ['required', 'integer'],
            'complectation_name' => [
                'required',
                'string',
                'max:255',
                // уникально в рамках одной модели
                Rule::unique('complectation', 'complectation_name')
                    ->where('model_id', $request->input('model_id')),
                // первая буква заглавная (RU/EN), дальше буквы/цифры/+/-
                'regex:/^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9+-]*$/u',
            ],
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
    } catch (ValidationException $e) {
        return response()->json([
            'message' => 'Ошибка валидации',
            'errors'  => $e->errors(),
        ], 422);
    }

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

    $minPrice = DB::table('complectation')
        ->where('model_id', $data['model_id'])
        ->min('price');

    DB::table('models')
        ->where('id', $data['model_id'])
        ->update(['min_price' => $minPrice]);

    $row = DB::table('complectation')->where('id', $id)->first();

    return response()->json($row, 201);
}

   public function complectationUpdate(Request $request, $id)
{
    try {
        $data = $request->validate([
            'model_id'           => ['required', 'integer'],
            'complectation_name' => [
                'required',
                'string',
                'max:255',
                // уникально в рамках модели, игнорируя текущую запись
                Rule::unique('complectation', 'complectation_name')
                    ->where('model_id', $request->input('model_id'))
                    ->ignore($id),
                'regex:/^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9+-]*$/u',
            ],
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
    } catch (ValidationException $e) {
        return response()->json([
            'message' => 'Ошибка валидации',
            'errors'  => $e->errors(),
        ], 422);
    }

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

    DB::table('models')
        ->where('id', $data['model_id'])
        ->update(['min_price' => $minPrice]);

    $updated = DB::table('complectation')->where('id', $id)->first();

    return response()->json($updated, 200);
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
        try {
            $data = $request->validate([
                'color_name' => [
                    'required',
                    'string',
                    'max:255',
                    // уникальность имени цвета
                    'unique:colors,color_name',
                    // первая буква заглавная, без пробелов/дефисов в начале/конце
                    'regex:/^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9]*(?:[ -][A-Za-zА-Яа-яЁё0-9]+)*$/u',
                ],
                'color_code' => [
                    'required',
                    'string',
                    'max:20',
                    // уникальность HEX
                    'unique:colors,color_code',
                    // формат #RRGGBB
                    'regex:/^#([0-9A-Fa-f]{6})$/',
                ],
            ]);
        } catch (ValidationException $e) {
            // чтобы фронту было проще понять, что именно сломалось
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors'  => $e->errors(),
            ], 422);
        }

        $color = Colors::create($data);

        return response()->json($color, 201);
    }

    public function updateClr(Request $request, $id)
    {
        $color = Colors::findOrFail($id);

        try {
            $data = $request->validate([
                'color_name' => [
                    'required',
                    'string',
                    'max:255',
                    // уникальность с игнором текущей записи
                    Rule::unique('colors', 'color_name')->ignore($color->id),
                    'regex:/^[A-ZА-ЯЁ][A-Za-zА-Яа-яЁё0-9]*(?:[ -][A-Za-zА-Яа-яЁё0-9]+)*$/u',
                ],
                'color_code' => [
                    'required',
                    'string',
                    'max:20',
                    Rule::unique('colors', 'color_code')->ignore($color->id),
                    'regex:/^#([0-9A-Fa-f]{6})$/',
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Ошибка валидации',
                'errors'  => $e->errors(),
            ], 422);
        }

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

            $name = trim($data['name']);

            // Проверка дубля по имени (без учёта регистра)
            $exists = DB::table('banks')
                ->whereRaw('LOWER(name) = LOWER(?)', [$name])
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Банк с таким названием уже существует',
                    'code'    => 'BANK_ALREADY_EXISTS',
                ], 409);
            }

            $logoPath = null;

            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('img/banks'), $filename);
                $logoPath = '/img/banks/' . $filename;
            }

            $id = DB::table('banks')->insertGetId([
                'name'        => $name,
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
            return response()->json(['message' => 'Ошибка сохранения банка'], 500);
        }
    }

    public function updateBank(Request $request, int $id)
    {
        try {
            $data = $request->validate([
                'name'        => ['required', 'string', 'max:255'],
                'deposit_min' => ['required', 'integer'],
                'min_percent' => ['required', 'integer'],
                'max_percent' => ['required', 'integer'],
                'min_month'   => ['required', 'integer'],
                'max_month'   => ['required', 'integer'],
                'logo'        => ['nullable', 'image', 'max:2048'], // при редактировании логотип не обязателен
            ]);

            $name = trim($data['name']);

            // Проверка дубля: тот же name, но у ДРУГОГО id
            $exists = DB::table('banks')
                ->whereRaw('LOWER(name) = LOWER(?)', [$name])
                ->where('id', '<>', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'message' => 'Банк с таким названием уже существует',
                    'code'    => 'BANK_ALREADY_EXISTS',
                ], 409);
            }

            // Текущий банк
            $bank = DB::table('banks')->where('id', $id)->first();
            if (!$bank) {
                return response()->json(['message' => 'Банк не найден'], 404);
            }

            $logoPath = $bank->logo; // по умолчанию оставляем старый логотип

            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->move(public_path('img/banks'), $filename);
                $logoPath = '/img/banks/' . $filename;
            }

            DB::table('banks')
                ->where('id', $id)
                ->update([
                    'name'        => $name,
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
            return response()->json(['message' => 'Ошибка обновления банка'], 500);
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
        $validated = $request->validate([
            'model_id'         => 'required|integer|exists:models,id',
            'complectation_id' => 'required|integer|exists:complectation,id',
            'color_id'         => 'required|integer|exists:colors,id',
            'vin'              => 'required|string|size:17|unique:cars,vin',
            'price'            => 'required|integer|min:1',
            'img_1'            => 'required|image|max:5120',
            'img_2'            => 'nullable|image|max:5120',
            'img_3'            => 'nullable|image|max:5120',
            'img_4'            => 'nullable|image|max:5120',
            'img_5'            => 'nullable|image|max:5120',
        ]);

        $car = new Cars();

        $car->model_id         = $validated['model_id'];
        $car->complectation_id = $validated['complectation_id'];
        $car->color_id         = $validated['color_id'];
        $car->dealer_id        = $request->dealer_id; // или auth()->id()
        $car->vin              = $validated['vin'];
        $car->price            = $validated['price'];
        $car->status           = 0;

        // img_1 обязательно
        if ($request->hasFile('img_1')) {
            $car->img_1 = $request->file('img_1')->store('cars', 'public');
        }

        // Для опциональных — либо путь, либо ПУСТАЯ СТРОКА
        $car->img_2 = $request->hasFile('img_2')
            ? $request->file('img_2')->store('cars', 'public')
            : '';

        $car->img_3 = $request->hasFile('img_3')
            ? $request->file('img_3')->store('cars', 'public')
            : '';

        $car->img_4 = $request->hasFile('img_4')
            ? $request->file('img_4')->store('cars', 'public')
            : '';

        $car->img_5 = $request->hasFile('img_5')
            ? $request->file('img_5')->store('cars', 'public')
            : '';

        $car->save();

        return response()->json([
            'message' => 'Автомобиль успешно создан',
            'data'    => $car,
        ], 201);
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
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Models extends Model
{
    protected $table = 'Models';

    protected $fillable = ['id', 'model_name', 'length', 'width', 'height', 'whellbase', 'clearance', 
                           'trunk', 'fuel_tank', 'engine_m', 'min_price', 'img', 'description', 
                           'description_full', 'salon_photo', 'features'];
}

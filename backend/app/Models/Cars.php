<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cars extends Model
{
    protected $table = 'Cars';

    protected $fillable = ['id', 'model_id', 'complectation_id', 'color_id', 'VIN', 'dealer_id', 'price'];

}

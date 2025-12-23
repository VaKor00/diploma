<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cars extends Model
{
    protected $table = 'Cars';

    public $timestamps = false;

    protected $fillable = [
        'model_id',
        'complectation_id',
        'color_id',
        'VIN',
        'dealer_id',
        'img_1',
        'img_2',
        'img_3',
        'img_4',
        'img_5',
        'price',
        'status',
    ];
    
}

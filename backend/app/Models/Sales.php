<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sales extends Model
{
    protected $table = 'sales';

    protected $fillable = ['id', 'client_id', 'car_id', 'vin', 'price', 'status'];

    public $timestamps = false; 
}

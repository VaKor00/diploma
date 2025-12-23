<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dealers extends Model
{
    protected $table = 'Dealers';

    public $timestamps = false;

    protected $fillable = ['id', 'city', 'city_name', 'street', 'home', 'name', 'open', 
                           'closed', 'timezone', 'phone', 'coord_x', 'coord_y', 'login'];

    public function getOpenAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('H:i');
    }

    public function getClosedAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('H:i');
    }

}

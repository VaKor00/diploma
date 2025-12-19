<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complectation extends Model
{
    protected $table = 'Complectation';

    protected $fillable = ['id', 'model_id', 'complectation_name', 'price', 'engine', 'track_fuel', 'city_fuel', 'transmission', 'brakes', 'wheel_drive', 'weight', 'headlights', 'hatch', 'tinting', 'airbag', 'heated_front_seats', 'heated_rear_seats', 'salon', 'seats', 'conditions', 'Cruise_control', 'apple_Carplay_android_auto', 'audio_speakers', 'usb'];
}

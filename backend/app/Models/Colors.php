<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Colors extends Model
{
    protected $table = 'colors';

    protected $fillable = ['id', 'color_name', 'color_code'];

    public $timestamps = false;
}

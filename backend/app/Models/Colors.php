<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Colors extends Model
{
    protected $table = 'Colors';

    protected $fillable = ['id', 'color_name', 'color_code'];

}

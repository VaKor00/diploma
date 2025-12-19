<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banks extends Model
{
    protected $table = 'banks';

    protected $fillable = ['id', 'name', 'logo', 'deposit_min', 'min_percent', 'max_percent', 'min_month', 'max_month'];

}

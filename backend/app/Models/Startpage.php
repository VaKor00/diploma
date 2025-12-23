<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Startpage extends Model
{
    protected $table = 'startpage';

    protected $fillable = [
        'name',
        'edit_content',
        'desc',
        'button_bool',
        'button',
        'link',
        'img',
        'priority',
    ];
}

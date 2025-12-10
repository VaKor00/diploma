<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Startpage extends Model
{
    protected $table = 'startpage';

    protected $fillable = ['id', 'name', 'edit_content', 'desc', 'button_boot', 'button', 'link', 'img', 'priority'];
}

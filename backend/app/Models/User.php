<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{

    protected $table = 'users';

    public $timestamps = false;

    protected $fillable = [
        'first_name',
        'last_name',
        'type',
        'login',
        'password',
        'dealer_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    // логинимся по полю login
    public function getAuthIdentifierName()
    {
        return 'login';
    }
}

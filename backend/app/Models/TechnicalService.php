<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TechnicalService extends Model
{
    protected $table = 'technical_service';

    protected $fillable = [
        'id',
        'dealer_id',
        'client_id',
        'modelcar_id',
        'vin',
        'date_service',
        'time_service',
        'status_ts',
    ];

    public $timestamps = false; 

    public function dealers()
    {
        return $this->belongsTo(Dealers::class, 'dealer_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EntityDropdown extends Model
{
    protected $fillable = [
        'title',
        'dropdowns'
    ];

    protected $casts = [
        'title' => 'encrypted',
        'dropdowns' => 'encrypted:array'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    protected $fillable = [
    'title',
    'description',
    'points_reward',
    'start_date',
    'end_date',
    'active',
];

}

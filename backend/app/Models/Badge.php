<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model {
  protected $fillable = [
    'code',
    'title',
    'description',
    'icon',
    'points_reward',
    'category',
    'tier',
    'rarity',
    'unlock_rule_type',
    'unlock_value',
    'is_active'
];

}


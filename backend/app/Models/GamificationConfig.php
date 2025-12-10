<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GamificationConfig extends Model {
  protected $fillable = ['key','value'];
  public static function get($key, $fallback = null) {
    $c = static::where('key',$key)->first();
    return $c ? $c->value : $fallback;
  }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserStreak extends Model {
  protected $fillable = ['user_id','current_streak','last_action_date'];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserChallenge extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'challenge_id', 'completed_at'
    ];
}

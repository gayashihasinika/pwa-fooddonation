<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'role',
        'password',
        'organization',
    ];

    protected $hidden = ['password'];

    public function points(){ return $this->hasOne(UserPoint::class); }
public function badges(){ return $this->hasMany(UserBadge::class); }
public function streak(){ return $this->hasOne(UserStreak::class); }
public function donations() {
    return $this->hasMany(Donation::class, 'user_id');
}

public function routeNotificationForSms()
    {
        return $this->phone;
    }



}



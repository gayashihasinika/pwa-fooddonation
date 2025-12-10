<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserBadge extends Model
{
    protected $table = 'user_badges';
    public $timestamps = false;

    protected $fillable = [
        'user_id', 'badge_id'
    ];

    public function badge() {
        return $this->belongsTo(Badge::class, 'badge_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}

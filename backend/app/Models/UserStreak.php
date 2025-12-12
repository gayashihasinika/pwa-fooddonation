<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserStreak extends Model
{
    use HasFactory;

    // Table name
    protected $table = 'user_streaks';

    // Mass assignable fields
    protected $fillable = [
        'user_id',
        'current_streak',
        'last_action_date',
        'longest_streak',
        'monthly_streak',
        'monthly_streak_month',
        'last_awarded_at',
    ];

    // Date / timestamp fields
    protected $dates = [
        'last_action_date',
        'monthly_streak_month',
        'last_awarded_at',
        'created_at',
        'updated_at',
    ];

    /**
     * Relationship: A streak belongs to a user
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

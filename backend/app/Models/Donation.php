<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'title', 'description', 'quantity', 'pickup_address', 'expiry_date', 'status',
        'pickup_time', 'category', 'allergy_tags', 'freshness_level' // Added new fields
    ];

    protected $casts = [
        'expiry_date' => 'date',
        'pickup_time' => 'datetime',
        'allergy_tags' => 'array', // JSON as array
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(DonationImage::class);
    }

    public function claims()
{
    return $this->hasMany(Claim::class);
}

public function donor()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}


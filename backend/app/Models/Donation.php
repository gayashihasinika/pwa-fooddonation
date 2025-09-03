<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'quantity',
        'pickup_address',
        'expiry_date',
        'status',
    ];

    public function images()
    {
        return $this->hasMany(DonationImage::class);
    }
}


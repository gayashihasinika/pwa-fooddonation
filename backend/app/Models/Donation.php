<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\DonationImage;
class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'quantity',
        'pickup_address',
        'status',
    ];

public function images()
{
    return $this->hasMany(DonationImage::class);
}

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

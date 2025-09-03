<?php

// app/Models/DonationImage.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'donation_id',
        'image_path',
    ];

    public function donation()
    {
        return $this->belongsTo(Donation::class);
    }
}

<?php

namespace App\Http\Controllers\Receivers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GamificationController extends Controller
{
    public function claimDonation()
    {
        return app(GamificationService::class)->awardPoints(auth()->id(), 'receiver.claim');
    }
}

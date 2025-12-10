<?php

namespace App\Http\Controllers\Volunteers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class GamificationController extends Controller
{
    public function deliveryCompleted()
    {
        return app(GamificationService::class)->awardPoints(auth()->id(), 'volunteer.delivery_complete');
    }
}

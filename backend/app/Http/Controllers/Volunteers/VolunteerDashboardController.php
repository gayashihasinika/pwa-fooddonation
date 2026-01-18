<?php

namespace App\Http\Controllers\Volunteers;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class VolunteerDashboardController extends Controller
{
    public function stats()
    {
        $volunteerId = Auth::id();

        $deliveries = Claim::where('volunteer_id', $volunteerId)
            ->where('status', 'delivered')
            ->count();

        $meals = Claim::where('volunteer_id', $volunteerId)
            ->where('status', 'delivered')
            ->join('donations', 'claims.donation_id', '=', 'donations.id')
            ->sum('donations.quantity');

        return response()->json([
            'deliveries' => $deliveries,
            'meals' => $meals,
            'people_helped' => $meals, // 1 meal = 1 person
            'co2_saved' => round($meals * 0.4, 2), // estimate
        ]);
    }
}

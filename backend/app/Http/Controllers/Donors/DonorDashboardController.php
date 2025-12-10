<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserPoint;
use App\Models\Badge;
use App\Models\UserBadge;

class DonorDashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Fetch user points
        $points = UserPoint::where('user_id', $userId)->value('points') ?? 0;

        // Fetch all badges
        $badges = Badge::all()->map(function ($badge) use ($userId) {
            $badge->unlocked = UserBadge::where('user_id', $userId)
                                        ->where('badge_id', $badge->id)
                                        ->exists();
            $badge->threshold = $badge->points_reward; // For frontend display
            return $badge;
        });

        return response()->json([
            'points' => $points,
            'badges' => $badges,
        ]);
    }
}

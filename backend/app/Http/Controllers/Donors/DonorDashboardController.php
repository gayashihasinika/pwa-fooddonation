<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\UserPoint;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\UserStreak;
use App\Models\Donation;

class DonorDashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        // Fetch points
        $points = UserPoint::where('user_id', $userId)->value('points') ?? 0;

        // Fetch streak record
        $streak = UserStreak::where('user_id', $userId)->first();

        $streakDays = $streak ? $streak->current_streak : 0;

        // Total donations
        $totalDonations = Donation::where('user_id', $userId)->count();

        // Rank calculation (simple: position by points)
        $rank = UserPoint::where('points', '>', $points)->count() + 1;

        // Fetch badges
        $badges = Badge::all()->map(function ($badge) use ($userId) {
            $badge->unlocked = UserBadge::where('user_id', $userId)
                                        ->where('badge_id', $badge->id)
                                        ->exists();
            $badge->threshold = $badge->points_reward;
            return $badge;
        });

        return response()->json([
            'points' => $points,
            'streakDays' => $streakDays,
            'badges' => $badges,
            'rank' => $rank,
            'totalDonations' => $totalDonations,
        ]);
    }
}

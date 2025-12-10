<?php
namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\UserPoint;
use Illuminate\Support\Facades\Auth;

class GamificationController extends Controller
{
    // Get all badges with donor info
    public function index()
    {
        $userId = Auth::id();

        $points = UserPoint::where('user_id', $userId)->value('points') ?? 0;

        $badges = Badge::all()->map(function($badge) use ($userId) {
            $badge->earned = UserBadge::where('user_id', $userId)
                                      ->where('badge_id', $badge->id)
                                      ->exists();
            return $badge;
        });

        return response()->json([
            'points' => $points,
            'badges' => $badges
        ]);
    }

    // Check & assign new badges
    public function checkAndAssign()
    {
        $userId = Auth::id();
        $points = UserPoint::where('user_id', $userId)->value('points') ?? 0;

        $badges = Badge::all();

        $awarded = [];

        foreach ($badges as $badge) {
            $hasBadge = UserBadge::where('user_id', $userId)
                                 ->where('badge_id', $badge->id)
                                 ->exists();
            if ($hasBadge) continue;

            if ($points >= $badge->points_reward) {
                UserBadge::create([
                    'user_id' => $userId,
                    'badge_id' => $badge->id,
                    'awarded_at' => now()
                ]);
                $awarded[] = $badge;
            }
        }

        return response()->json([
            'awarded_badges' => $awarded
        ]);
    }
}

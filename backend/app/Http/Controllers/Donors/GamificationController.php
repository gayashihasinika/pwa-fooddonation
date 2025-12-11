<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\UserPoint;
use App\Models\Challenge;
use App\Models\UserChallenge;
use Illuminate\Support\Facades\Auth;

class GamificationController extends Controller
{
    // ==========================
    // 1. GET Badge Dashboard
    // ==========================
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

    // ==========================
    // 2. Check & Assign Badges
    // ==========================
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

            if (!$hasBadge && $points >= $badge->points_reward) {
                UserBadge::create([
                    'user_id' => $userId,
                    'badge_id' => $badge->id,
                    'awarded_at' => now()
                ]);
                $awarded[] = $badge;
            }
        }

        return response()->json(['awarded_badges' => $awarded]);
    }

    // ==========================
    // 3. Get Active Challenges for Donor
    // ==========================
    public function getChallenges()
{
    $userId = Auth::id();
    $today = now()->toDateString();

    $challenges = Challenge::all()->map(function($challenge) use ($userId, $today) {

        // Check completion
        $challenge->completed = UserChallenge::where('user_id', $userId)
                                             ->where('challenge_id', $challenge->id)
                                             ->exists();

        // Determine challenge status
        if ($challenge->completed) {
            $challenge->status = "completed";

        } elseif ($challenge->start_date > $today) {
            $challenge->status = "upcoming";

        } elseif ($challenge->end_date < $today) {
            $challenge->status = "expired"; // optional if needed

        } elseif ($challenge->active == 1) {
            $challenge->status = "active";

        } else {
            $challenge->status = "inactive";
        }

        return $challenge;
    });

    return response()->json([
        'challenges' => $challenges
    ]);
}


    // ==========================
    // 4. Complete a Challenge
    // ==========================
    public function completeChallenge($id)
    {
        $userId = Auth::id();

        $challenge = Challenge::findOrFail($id);

        // Already completed?
        $alreadyDone = UserChallenge::where('user_id', $userId)
                                    ->where('challenge_id', $id)
                                    ->exists();
        if ($alreadyDone) {
            return response()->json(['message' => 'Challenge already completed'], 400);
        }

        // Mark challenge completed
        UserChallenge::create([
            'user_id' => $userId,
            'challenge_id' => $id,
            'completed_at' => now()
        ]);

        // Award points
        $userPoints = UserPoint::firstOrCreate(['user_id' => $userId]);
        $userPoints->points += $challenge->points_reward;
        $userPoints->save();

        // Check & award badges
        $this->checkAndAssign();

        return response()->json([
            'message' => 'Challenge completed successfully',
            'points_rewarded' => $challenge->points_reward
        ]);
    }
}

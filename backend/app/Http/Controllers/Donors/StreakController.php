<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\StreakService;
use Illuminate\Support\Facades\Auth;
use App\Models\UserPoint;

class StreakController extends Controller
{
    // GET /donors/streak
    public function show()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Get user's streak
        $streak = StreakService::getForUser($user->id);

        // Get user's points
        $points = UserPoint::where('user_id', $user->id)->value('points') ?? 0;

        return response()->json([
            'streak' => $streak,
            'points' => $points,
        ]);
    }

    // POST /donors/streaks/process
    // Call this after a donation is created
    public function process(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $donationAt = $request->input('donation_at', now());

        $result = StreakService::process($user->id, $donationAt);

        return response()->json(['result' => $result]);
    }
}

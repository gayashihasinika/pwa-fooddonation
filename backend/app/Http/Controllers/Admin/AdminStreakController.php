<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserStreak;
use Illuminate\Support\Facades\DB;

class AdminStreakController extends Controller
{
    // GET /admin/streaks
    public function index()
    {
        $rows = UserStreak::with('user:id,name,email')
            ->orderByDesc('current_streak')
            ->get()
            ->map(function ($s) {
                return [
                    'user_id' => $s->user_id,
                    'name' => $s->user->name ?? null,
                    'email' => $s->user->email ?? null,
                    'current_streak' => $s->current_streak,
                    'last_action_date' => $s->last_action_date,
                    'longest_streak' => $s->longest_streak,
                    'monthly_streak' => $s->monthly_streak,
                    'monthly_streak_month' => $s->monthly_streak_month,
                    'last_awarded_at' => $s->last_awarded_at,
                ];
            });

        return response()->json(['streaks' => $rows]);
    }

    // GET /admin/streaks/leaderboard (top X donors)
    public function leaderboard(Request $request)
    {
        $limit = intval($request->query('limit', 10));

        $rows = UserStreak::with('user:id,name')
            ->orderByDesc('current_streak')
            ->limit($limit)
            ->get()
            ->map(fn($s) => [
                'user_id' => $s->user_id,
                'name' => $s->user->name ?? null,
                'current_streak' => $s->current_streak,
                'longest_streak' => $s->longest_streak,
            ]);

        return response()->json(['leaderboard' => $rows]);
    }
}

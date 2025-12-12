<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Challenge;
use App\Models\UserChallenge;

class AdminChallengeProgressController extends Controller
{
    public function index()
    {
        $completed = UserChallenge::with([
            'user:id,name',
            'challenge:id,title,points_reward'
        ])
        ->orderBy('completed_at', 'desc')
        ->get()
        ->map(function ($uc) {
            return [
                'id' => $uc->id,
                'donor_name' => $uc->user->name,
                'challenge_title' => $uc->challenge->title,
                'points_reward' => $uc->challenge->points_reward,
                'completed_at' => $uc->completed_at,
            ];
        });

        return response()->json([
            'completed_challenges' => $completed
        ]);
    }
}

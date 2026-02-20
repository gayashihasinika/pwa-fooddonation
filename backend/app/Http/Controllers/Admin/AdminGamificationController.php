<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Badge;
use App\Models\GamificationConfig;
use App\Models\Challenge;

class AdminGamificationController extends Controller
{
    /**
     * Get all badges and gamification configs
     */
    public function index()
    {
        $badges = Badge::all();
        $configs = GamificationConfig::all();
        $challenges = Challenge::all();

        return response()->json([
            'badges' => $badges,
            'configs' => $configs,
            'challenges' => $challenges
        ]);
    }

    /**
     * Create a new badge
     */
   public function storeBadge(Request $request)
{
    $data = $request->validate([
        'code' => 'required|unique:badges,code',
        'title' => 'required|string',
        'description' => 'nullable|string',
        'icon' => 'nullable|string',
        'points_reward' => 'required|integer|min:0',
        'category' => 'nullable|string',
        'tier' => 'nullable|integer|min:1',
        'rarity' => 'nullable|in:common,rare,epic,legendary',
        'unlock_rule_type' => 'nullable|string',
        'unlock_value' => 'nullable|integer|min:1',
        'is_active' => 'nullable|boolean',
    ]);

    $data['category'] = $data['category'] ?? 'donation';
    $data['tier'] = $data['tier'] ?? 1;
    $data['rarity'] = $data['rarity'] ?? 'common';
    $data['is_active'] = $data['is_active'] ?? true;

    $badge = Badge::create($data);

    return response()->json(['success'=>true, 'badge'=>$badge], 201);
}

    /**
     * Show a single badge with donors who earned it (optional)
     */
    public function earnedBadges()
{
    $earned = \DB::table('user_badges') // Use the correct table name
        ->join('users', 'user_badges.user_id', '=', 'users.id')
        ->join('badges', 'user_badges.badge_id', '=', 'badges.id')
        ->select(
            'user_badges.id',
            'users.name as donor_name',
            'badges.title as badge_title',
            'badges.points_reward as points',
            'user_badges.awarded_at as earned_at' // Correct timestamp column
        )
        ->orderBy('user_badges.awarded_at', 'desc')
        ->get();

    return response()->json([
        'earned_badges' => $earned
    ]);
}
   

    /**
     * Update an existing badge
     */
    public function updateBadge(Request $request, $id)
    {
        $badge = Badge::findOrFail($id);

        $request->validate([
            'code' => 'required|unique:badges,code,' . $id,
            'title' => 'required|string',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'points_reward' => 'required|integer|min:0',
        ]);

        $badge->update($request->all());

        return response()->json(['success' => true, 'badge' => $badge]);
    }

    /**
     * Update gamification config (point values, streaks)
     */
    public function updateConfig(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required'
        ]);

        GamificationConfig::updateOrCreate(
            ['key' => $request->key],
            ['value' => $request->value]
        );

        return response()->json(['success' => true]);
    }

    /**
     * Create a challenge
     */
    public function createChallenge(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'points_reward' => 'required|integer|min:1',
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'active' => 'required|boolean',
    ]);

    try {
        $challenge = Challenge::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'points_reward' => $validated['points_reward'],
            'start_date' => $validated['start_date'] ?? null,
            'end_date' => $validated['end_date'] ?? null,
            'active' => $validated['active'],
        ]);

        return response()->json([
            'message' => 'Challenge created successfully',
            'challenge' => $challenge
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to create challenge',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function earnedChallenges()
{
    // Fetch all users who completed challenges
    $earned = DB::table('user_challenges')
        ->join('users', 'user_challenges.user_id', '=', 'users.id')
        ->join('challenges', 'user_challenges.challenge_id', '=', 'challenges.id')
        ->select(
            'user_challenges.id',
            'users.name as donor_name',
            'challenges.title as challenge_title',
            'challenges.points_reward as points',
            'user_challenges.completed_at as completed_at'
        )
        ->orderBy('user_challenges.completed_at', 'desc')
        ->get();

    return response()->json([
        'earned_challenges' => $earned
    ]);
}


    /**
     * Update challenge
     */
    public function updateChallenge(Request $request, $id)
    {
        $challenge = Challenge::findOrFail($id);

        $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'points_reward' => 'required|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'active' => 'required|boolean'
        ]);

        $challenge->update($request->all());

        return response()->json(['success' => true, 'challenge' => $challenge]);
    }

    public function destroy($id)
{
    $badge = Badge::findOrFail($id);
    $badge->delete();
    return response()->json(['success' => true]);
}
}

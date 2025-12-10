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
        'category' => 'required|string',
        'tier' => 'nullable|integer|min:1',
        'rarity' => 'nullable|in:common,rare,epic,legendary',
        'unlock_rule_type' => 'nullable|string',
        'unlock_value' => 'nullable|integer|min:1',
        'is_active' => 'nullable|boolean',
    ]);

    $badge = Badge::create($data);

    return response()->json(['success'=>true, 'badge'=>$badge], 201);
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

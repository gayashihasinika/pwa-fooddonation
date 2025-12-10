<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserPoint;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\GamificationConfig;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class GamificationService
{
    /**
     * Award points to a user for a specific action.
     */
    public function awardPoints($userId, $action)
    {
        // Get points from config table (dynamic)
        $points = GamificationConfig::where('key', "points_" . $action)->value('value');

        if (!$points) {
            return ['success' => false, 'message' => "No points config found for: $action"];
        }

        // Update or create user points
        $record = UserPoint::firstOrCreate(['user_id' => $userId], ['points' => 0]);
        $record->points += (int)$points;
        $record->save();

        // After awarding points, check for possible badges
        $this->checkAndAssignBadges($userId);

        return [
            'success' => true,
            'message' => "$points points awarded",
            'points'  => $record->points
        ];
    }

    /**
     * Check and assign badges to a user based on points or achievements.
     */
    public function checkAndAssignBadges($userId)
    {
        $user = User::find($userId);
        if (!$user) return;

        // Get all ACTIVE badges that user has NOT earned yet
        $badges = Badge::where('is_active', true)
            ->whereNotIn('id', function ($q) use ($userId) {
                $q->select('badge_id')
                  ->from('user_badges')
                  ->where('user_id', $userId);
            })->get();

        foreach ($badges as $badge) {
            if ($this->canUnlockBadge($userId, $badge)) {
                $this->awardBadge($userId, $badge);
            }
        }
    }

    /**
     * Determine if user meets unlock rule conditions.
     */
    private function canUnlockBadge($userId, $badge): bool
    {
        switch ($badge->unlock_rule_type) {

            case 'points_total':
                $points = UserPoint::where('user_id', $userId)->value('points') ?? 0;
                return $points >= $badge->unlock_value;

            case 'donations_count':
                $count = DB::table('donations')
                    ->where('user_id', $userId)
                    ->count();
                return $count >= $badge->unlock_value;

            case 'donations_in_week':
                $count = DB::table('donations')
                    ->where('user_id', $userId)
                    ->whereBetween('created_at', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ])
                    ->count();
                return $count >= $badge->unlock_value;

            case 'deliveries_count':
                $count = DB::table('deliveries')
                    ->where('volunteer_id', $userId)
                    ->where('status', 'completed')
                    ->count();
                return $count >= $badge->unlock_value;

            case 'weight_donated_total':
                $totalWeight = DB::table('donations')
                    ->where('user_id', $userId)
                    ->sum('weight');
                return $totalWeight >= $badge->unlock_value;

            default:
                // If badge has no unlock rule → fallback to points
                $userPoints = UserPoint::where('user_id', $userId)->value('points') ?? 0;
                return $userPoints >= $badge->points_reward;
        }
    }

    /**
     * Award badge to user.
     */
    private function awardBadge($userId, $badge)
    {
        UserBadge::create([
            'user_id'  => $userId,
            'badge_id' => $badge->id,
        ]);

        // Optional: give points reward
        if ($badge->points_reward > 0) {
            UserPoint::where('user_id', $userId)->increment('points', $badge->points_reward);
        }

        // You can trigger notifications here
        // Notification::send($user, new BadgeUnlockedNotification($badge));
    }

    /**
     * Update user streak system (daily login / daily activity).
     */
    public function updateStreak($userId)
    {
        $user = User::find($userId);

        $today = Carbon::today();
        $yesterday = Carbon::yesterday();

        $lastActive = Carbon::parse($user->last_active_at);

        // If user was active yesterday → increase streak
        if ($lastActive->isSameDay($yesterday)) {
            $user->streak = $user->streak + 1;
        }
        // If user missed a day → reset streak
        else if (!$lastActive->isSameDay($today)) {
            $user->streak = 1;
        }

        // Update last active date
        $user->last_active_at = now();
        $user->save();

        return $user->streak;
    }

    /**
     * Leaderboard: Top users based on points.
     */
    public function calculateLeaderboard($limit = 10)
    {
        return UserPoint::with('user')
            ->orderByDesc('points')
            ->limit($limit)
            ->get();
    }
}

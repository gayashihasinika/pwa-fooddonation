<?php

namespace App\Services;

use App\Models\UserStreak;
use App\Models\UserPoint;
use App\Models\UserBadge;
use App\Models\Badge;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StreakService
{
    /**
     * Process a donor action (like a donation) for streak updates.
     * Call this after a donation is created: StreakService::process($userId, $actionAt)
     *
     * @param int $userId
     * @param string|Carbon $actionAt
     * @return array info about updated streak and awarded badges/points
     */
    public static function process(int $userId, $actionAt)
    {
        $actionAt = $actionAt instanceof Carbon ? $actionAt : Carbon::parse($actionAt);
        $today = $actionAt->toDateString();

        return DB::transaction(function () use ($userId, $actionAt, $today) {
            $streak = UserStreak::firstOrCreate(['user_id' => $userId]);

            $result = [
                'previous_streak' => $streak->current_streak,
                'new_streak' => null,
                'awarded' => [],
            ];

            $lastAction = $streak->last_action_date ? Carbon::parse($streak->last_action_date)->toDateString() : null;

            // Already done today
            if ($lastAction === $today) {
                $result['new_streak'] = $streak->current_streak;
            } else {
                // Increment streak if last action was yesterday, otherwise reset
                $wasYesterday = $lastAction && Carbon::parse($lastAction)->addDay()->toDateString() === $today;
                $streak->current_streak = $wasYesterday ? $streak->current_streak + 1 : 1;

                // Update longest streak
                if ($streak->current_streak > $streak->longest_streak) {
                    $streak->longest_streak = $streak->current_streak;
                }

                // Handle monthly streak
                $monthStart = $actionAt->copy()->startOfMonth()->toDateString();
                if (!$streak->monthly_streak_month || Carbon::parse($streak->monthly_streak_month)->toDateString() !== $monthStart) {
                    $streak->monthly_streak = 1;
                    $streak->monthly_streak_month = $monthStart;
                } else {
                    $streak->monthly_streak += ($lastAction !== $today ? 1 : 0);
                }

                // Update last action date
                $streak->last_action_date = $today;
                $streak->save();

                $result['new_streak'] = $streak->current_streak;
            }

            // Award badges for streaks
            self::awardBadgeForStreak($userId, $streak, 3, 'streak_3days', $result);
            self::awardBadgeForStreak($userId, $streak, 7, 'streak_7days', $result);
            self::awardBadgeForStreak($userId, $streak, 14, 'streak_14days', $result);

            // Award badge for monthly streak
            if ($streak->monthly_streak >= 28) { // configurable threshold
                self::awardBadge($userId, 'monthly_streak', $result);
            }

            return $result;
        });
    }

    /**
     * Award a streak badge if the threshold is reached
     */
    protected static function awardBadgeForStreak(int $userId, UserStreak $streak, int $threshold, string $badgeCode, array &$result)
    {
        if ($streak->current_streak >= $threshold) {
            self::awardBadge($userId, $badgeCode, $result);
        }
    }

    /**
     * Award badge and points
     */
    protected static function awardBadge(int $userId, string $badgeCode, array &$result)
    {
        $badge = Badge::where('code', $badgeCode)->first();
        if (!$badge) return;

        $alreadyAwarded = UserBadge::where('user_id', $userId)
            ->where('badge_id', $badge->id)
            ->exists();

        if (!$alreadyAwarded) {
            UserBadge::create([
                'user_id' => $userId,
                'badge_id' => $badge->id,
                'awarded_at' => now(),
            ]);

            $userPoints = UserPoint::firstOrCreate(['user_id' => $userId]);
            $userPoints->points += $badge->points_reward;
            $userPoints->save();

            $result['awarded'][] = [
                'type' => 'badge',
                'badge_code' => $badge->code,
                'points' => $badge->points_reward,
            ];
        }
    }

    /**
     * Get streak info for a specific user
     */
    public static function getForUser(int $userId)
    {
        $streak = UserStreak::where('user_id', $userId)->first();
        return $streak ? $streak->toArray() : null;
    }
}

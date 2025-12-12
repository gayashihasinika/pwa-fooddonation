<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Badge;

class StreakBadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 3-day streak badge
        Badge::updateOrCreate(
            ['code' => 'streak_3days'],
            [
                'title' => '3-Day Giving Streak',
                'description' => 'Donate on 3 consecutive days',
                'points_reward' => 20,
                'category' => 'streak',
                'tier' => 1,
                'rarity' => 'common',
                'icon' => 'streak3',
                'is_active' => 1,
            ]
        );

        // 7-day streak badge
        Badge::updateOrCreate(
            ['code' => 'streak_7days'],
            [
                'title' => '7-Day Giving Streak',
                'description' => 'Donate on 7 consecutive days',
                'points_reward' => 50,
                'category' => 'streak',
                'tier' => 1,
                'rarity' => 'rare',
                'icon' => 'streak7',
                'is_active' => 1,
            ]
        );

        // 14-day streak badge
        Badge::updateOrCreate(
            ['code' => 'streak_14days'],
            [
                'title' => '14-Day Giving Streak',
                'description' => 'Donate on 14 consecutive days',
                'points_reward' => 100,
                'category' => 'streak',
                'tier' => 2,
                'rarity' => 'epic',
                'icon' => 'streak14',
                'is_active' => 1,
            ]
        );

        // Monthly streak badge (30-day streak)
        Badge::updateOrCreate(
            ['code' => 'monthly_streak'],
            [
                'title' => 'Monthly Giving Streak',
                'description' => 'Maintain donation streak for 30 consecutive days',
                'points_reward' => 200,
                'category' => 'streak',
                'tier' => 3,
                'rarity' => 'legendary',
                'icon' => 'streakMonthly',
                'is_active' => 1,
            ]
        );
    }
}

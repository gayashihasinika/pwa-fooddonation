<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Badge;

class BadgeSeeder extends Seeder
{
    public function run()
    {
        $now = now();

        $badges = [
            [
                'code'=>'FIRST_DONATION',
                'title'=>'First Donation',
                'description'=>'Made first donation',
                'points_reward'=>10,
                'category'=>'donation',
                'tier'=>1,
                'rarity'=>'common',
                'icon'=>'star',
                'unlock_rule_type'=>'donations_count',
                'unlock_value'=>1,
                'is_active'=>true,
            ],
            [
                'code'=>'WEEKLY_HERO',
                'title'=>'Weekly Hero',
                'description'=>'Donated 3 times in a week',
                'points_reward'=>30,
                'category'=>'donation',
                'tier'=>2,
                'rarity'=>'rare',
                'icon'=>'sparkles',
                'unlock_rule_type'=>'donations_in_week',
                'unlock_value'=>3,
                'is_active'=>true,
            ],
            [
                'code'=>'VOL_DELIVERY_STAR',
                'title'=>'Delivery Star',
                'description'=>'10 successful volunteer deliveries',
                'points_reward'=>100,
                'category'=>'volunteer',
                'tier'=>3,
                'rarity'=>'epic',
                'icon'=>'trophy',
                'unlock_rule_type'=>'deliveries_count',
                'unlock_value'=>10,
                'is_active'=>true,
            ],
        ];

        foreach ($badges as $badge) {
            Badge::firstOrCreate(
                ['code' => $badge['code']], // check uniqueness
                array_merge($badge, ['created_at'=>$now, 'updated_at'=>$now])
            );
        }
    }
}

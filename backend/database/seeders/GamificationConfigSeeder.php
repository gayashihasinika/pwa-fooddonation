<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\GamificationConfig;  

class GamificationConfigSeeder extends Seeder
{
    public function run(): void
    {
        GamificationConfig::updateOrCreate(['key'=>'points_post_donation'], ['value'=>'20']);
        GamificationConfig::updateOrCreate(['key'=>'points_donation_claimed'], ['value'=>'30']);
        GamificationConfig::updateOrCreate(['key'=>'points_upload_image'], ['value'=>'10']);
        GamificationConfig::updateOrCreate(['key'=>'points_streak_bonus_daily'], ['value'=>'15']);

        // receivers
        GamificationConfig::updateOrCreate(['key'=>'points_receiver_claim'], ['value'=>'10']);
        GamificationConfig::updateOrCreate(['key'=>'points_receiver_feedback'], ['value'=>'15']);
        GamificationConfig::updateOrCreate(['key'=>'points_receiver_on_time'], ['value'=>'5']);

        // volunteers
        GamificationConfig::updateOrCreate(['key'=>'points_volunteer_delivery'], ['value'=>'40']);
        GamificationConfig::updateOrCreate(['key'=>'points_volunteer_on_time'], ['value'=>'10']);
        GamificationConfig::updateOrCreate(['key'=>'points_volunteer_3_in_week'], ['value'=>'15']);
    }
}

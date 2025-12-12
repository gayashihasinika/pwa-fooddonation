<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('user_streaks', function (Blueprint $table) {

            // Add only if columns do not already exist
            if (!Schema::hasColumn('user_streaks', 'longest_streak')) {
                $table->integer('longest_streak')->default(0)->after('current_streak');
            }

            if (!Schema::hasColumn('user_streaks', 'monthly_streak')) {
                $table->integer('monthly_streak')->default(0)->after('longest_streak');
            }

            if (!Schema::hasColumn('user_streaks', 'monthly_streak_month')) {
                $table->date('monthly_streak_month')->nullable()->after('monthly_streak');
            }

            if (!Schema::hasColumn('user_streaks', 'last_awarded_at')) {
                $table->timestamp('last_awarded_at')->nullable()->after('monthly_streak_month');
            }
        });
    }

    public function down(): void
    {
        Schema::table('user_streaks', function (Blueprint $table) {
            $table->dropColumn([
                'longest_streak',
                'monthly_streak',
                'monthly_streak_month',
                'last_awarded_at'
            ]);
        });
    }
};

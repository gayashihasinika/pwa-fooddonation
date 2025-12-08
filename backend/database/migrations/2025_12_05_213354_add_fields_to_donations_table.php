<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->datetime('pickup_time')->nullable()->after('pickup_address');
            $table->enum('category', ['rice', 'bread', 'packaged', 'event_food', 'curry', 'other'])->default('other')->after('pickup_time');
            $table->json('allergy_tags')->nullable()->after('category');
            $table->enum('freshness_level', ['freshly_cooked', 'yesterdays_leftover', 'other'])->default('other')->after('allergy_tags');
        });
    }

    public function down(): void
    {
        Schema::table('donations', function (Blueprint $table) {
            $table->dropColumn(['pickup_time', 'category', 'allergy_tags', 'freshness_level']);
        });
    }
};
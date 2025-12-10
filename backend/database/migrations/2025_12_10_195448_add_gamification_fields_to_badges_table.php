<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('badges', function (Blueprint $table) {
            $table->string('category')->default('donation')->after('title'); 
            $table->tinyInteger('tier')->default(1)->after('category');  
            $table->string('rarity')->default('common')->after('tier');   
            $table->string('unlock_rule_type')->nullable()->after('points_reward');
            $table->integer('unlock_value')->nullable()->after('unlock_rule_type');
            $table->boolean('is_active')->default(true)->after('unlock_value');
        });
    }

    public function down()
    {
        Schema::table('badges', function (Blueprint $table) {
            $table->dropColumn([
                'category', 'tier', 'rarity', 'unlock_rule_type',
                'unlock_value', 'is_active'
            ]);
        });
    }
};

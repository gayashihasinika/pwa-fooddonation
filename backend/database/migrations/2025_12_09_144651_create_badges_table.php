<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
    $table->id();
    $table->string('code')->unique();       // e.g. first_donation
    $table->string('title');
    $table->text('description')->nullable();
    $table->string('icon')->nullable();     // path to PNG
    $table->integer('points_reward')->default(0);
    $table->timestamps();
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};

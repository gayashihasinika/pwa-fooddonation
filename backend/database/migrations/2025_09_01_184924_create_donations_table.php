<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('donations', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('title');
    $table->text('description')->nullable();
    $table->integer('quantity')->default(1);
    $table->string('pickup_address');
    $table->date('expiry_date')->nullable();
    $table->enum('status', ['pending', 'approved', 'completed'])->default('pending');
    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('donations');
    }
};

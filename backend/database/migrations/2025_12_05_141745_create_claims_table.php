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
        Schema::create('claims', function (Blueprint $table) {
        $table->id();
        $table->foreignId('donation_id')->constrained()->onDelete('cascade');
        $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('volunteer_id')->nullable()->constrained('users')->onDelete('set null');
        $table->enum('status', ['pending', 'accepted', 'picked_up', 'delivered', 'cancelled', 'disputed'])
              ->default('pending');
        $table->text('notes')->nullable();
        $table->timestamp('claimed_at')->useCurrent();
        $table->timestamp('picked_up_at')->nullable();
        $table->timestamp('delivered_at')->nullable();
        $table->timestamps();

        $table->unique(['donation_id', 'receiver_id']);
        }); 
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};

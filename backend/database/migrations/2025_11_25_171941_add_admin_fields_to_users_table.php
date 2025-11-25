<?php
// database/migrations/xxxx_xx_xx_add_admin_fields_to_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_suspended')->default(false);
            $table->timestamp('email_verified_at')->nullable();
            $table->boolean('is_verified')->default(false); // For NGO / trusted user
            $table->text('verification_note')->nullable(); // Admin note
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_suspended', 'email_verified_at', 'is_verified', 'verification_note']);
        });
    }
};
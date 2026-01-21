<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;

class SmsService
{
    public function send(string $phone, string $message): void
    {
        Log::info("📱 Attempting SMS to {$phone}: {$message}");

        // LOCAL → log only
        if (app()->environment('local')) {
            return;
        }

        // 🔴 Production (Twilio later)
        // $client = new Client(...);
        // $client->messages->create(...)
    }
}

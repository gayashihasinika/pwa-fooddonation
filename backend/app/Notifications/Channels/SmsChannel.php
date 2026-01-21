<?php

namespace App\Notifications\Channels;

use App\Services\SmsService;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Log;

class SmsChannel
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function send($notifiable, Notification $notification): void
    {
        try {
            // 1️⃣ Ensure notification has toSms()
            if (!method_exists($notification, 'toSms')) {
                Log::info('📱 SMS skipped: toSms() not found on ' . get_class($notification));
                return;
            }

            // 2️⃣ Ensure notifiable has a phone number
            $phone = $notifiable->phone ?? null;
            if (empty($phone)) {
                Log::info('📱 SMS skipped: phone_number missing for user id ' . $notifiable->id);
                return;
            }

            // 3️⃣ Generate message safely
            $message = $notification->toSms($notifiable);

            if (empty($message)) {
                Log::info('📱 SMS skipped: message is empty for user id ' . $notifiable->id);
                return;
            }

            // 4️⃣ Log and send SMS
            Log::info("📱 SMS sending to {$phone}: {$message}");
            $this->smsService->send($phone, $message);

        } catch (\Throwable $e) {
            // 5️⃣ Catch all errors to prevent queue crash
            Log::error('📱 SMS failed: ' . $e->getMessage() . ' in ' . get_class($notification));
        }
    }
}

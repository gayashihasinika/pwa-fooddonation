<?php

// backend/app/Notifications/ClaimApprovedNotification.php
// Donor aprove the receivers donation claim
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Notifications\Channels\SmsChannel;

class ClaimApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $claim) {}

    public function via($notifiable)
{
    return ['mail', 'database', SmsChannel::class];
}

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('🎉 Your Food Donation Claim Was Approved!')
            ->greeting('Hello ' . $notifiable->name)
            ->line('Great news! Your claim has been approved by the donor.')
            ->line('Donation: ' . $this->claim->donation->title)
            ->line('Pickup Address: ' . $this->claim->donation->pickup_address)
            ->action('View My Claims', url('/receivers/claims'))
            ->line('Thank you for being part of our community ❤️');
    }

    public function toArray($notifiable)
    {
        return [
            'claim_id' => $this->claim->id,
            'status' => 'approved',
            'donation_title' => $this->claim->donation->title,
        ];
    }

    public function toSms($notifiable)
{
    return "✅ Your claim for '{$this->claim->donation->title}' was APPROVED! You may now pick up the donation. ❤️";
}
}

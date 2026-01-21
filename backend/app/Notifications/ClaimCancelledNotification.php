<?php

namespace App\Notifications;

// backend/app/Notifications/ClaimCancelledNotification.php
// Donor cancels the receivers donation claim

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Contracts\Queue\ShouldQueue;

class ClaimCancelledNotification extends Notification implements ShouldQueue
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
            ->subject('❌ Your Food Donation Claim Was Cancelled')
            ->greeting('Hello ' . $notifiable->name)
            ->line('Unfortunately, the donor has cancelled your claim.')
            ->line('Donation: ' . $this->claim->donation->title)
            ->line('You can browse other available donations anytime.')
            ->action('Browse Donations', url('/receivers/donations'))
            ->line('We appreciate your understanding ❤️');
    }

    public function toArray($notifiable)
    {
        return [
            'claim_id' => $this->claim->id,
            'status' => 'cancelled',
            'donation_title' => $this->claim->donation->title,
        ];
    }

    public function toSms($notifiable)
{
    return "❌ Your claim for '{$this->claim->donation->title}' was CANCELLED by the donor. Please check other donations.";
}
}

<?php

// app/Notifications/DonationClaimedNotification.php
// Notify donor when a receiver claims their donation

namespace App\Notifications;

use App\Models\Donation;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Channels\SmsChannel;

class DonationClaimedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Donation $donation,
        public User $receiver
    ) {}

    public function via($notifiable)
{
    return ['mail', 'database', SmsChannel::class];
}



    /* ---------------- EMAIL ---------------- */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('❤️ Someone Accepted Your Donation!')
            ->greeting("Hello {$notifiable->name},")
            ->line("Great news! Your donation **{$this->donation->title}** has been accepted.")
            ->line("👤 Receiver: {$this->receiver->name}")
            ->line("📍 Pickup Address: {$this->donation->pickup_address}")
            ->line("📦 Quantity: {$this->donation->quantity}")
            ->action('View Donation', url("/donor/donations/{$this->donation->id}"))
            ->line("Thank you for making a difference in someone's life 🌍")
            ->salutation('— Food Donation Team');
    }

    /* ---------------- DATABASE ---------------- */
    public function toArray($notifiable)
    {
        return [
            'title' => 'Donation Accepted',
            'message' => "Your donation '{$this->donation->title}' has been accepted by {$this->receiver->name}.",
            'donation_id' => $this->donation->id,
        ];
    }

    /* ---------------- SMS ---------------- */
    public function toSms($notifiable)
    {
        return "Food Donation ❤️: Your donation '{$this->donation->title}' was accepted by {$this->receiver->name}. Thank you!";
    }
}

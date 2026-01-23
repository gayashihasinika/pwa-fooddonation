<?php

namespace App\Notifications;
// app/Notifications/DonationPickedUpNotification.php
// Notification sent to donors and receiver when their donation is picked up by a volunteer

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Channels\SmsChannel;

class DonationDeliveredNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $volunteerName
    ) {}

    public function via($notifiable)
    {
        return ['mail', SmsChannel::class];
    }

    public function toMail($notifiable)
    {
        if ($notifiable->role === 'donor') {
            return (new MailMessage)
                ->subject('Donation Delivered Successfully 🎉')
                ->greeting('Hello Donor!')
                ->line("Great news! The donation has been successfully delivered by volunteer {$this->volunteerName}.")
                ->line('Your generosity has made a real difference 💚')
                ->line('Thank you for being part of this mission!');
        }

        if ($notifiable->role === 'receiver') {
            return (new MailMessage)
                ->subject('Your Donation Has Arrived 🎉')
                ->greeting('Hello!')
                ->line("Good news! Volunteer {$this->volunteerName} has delivered your donation.")
                ->line('Enjoy your donation and thank you for being part of this mission 💚');
        }
    }

    public function toSms($notifiable)
    {
        if ($notifiable->role === 'donor') {
            return "Your donation has been delivered successfully by {$this->volunteerName}. Thank you for your generosity 💚";
        }

        if ($notifiable->role === 'receiver') {
            return "Good news! {$this->volunteerName} has delivered your donation. Enjoy and thank you 💚";
        }
    }
}

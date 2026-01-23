<?php

namespace App\Notifications;
// app/Notifications/DonationPickedUpNotification.php
// Notification sent to donors and receiver when their donation is picked up by a volunteer

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Channels\SmsChannel;

class DonationPickedUpNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $volunteerName
    ) {}

    public function via($notifiable)
    {
        // ✅ Use SmsChannel class, not 'sms' string
        return ['mail', SmsChannel::class];
    }

    public function toMail($notifiable)
    {
        if ($notifiable->role === 'donor') {
            return (new MailMessage)
                ->subject('Your donation has been picked up 🚚')
                ->greeting('Hello Donor!')
                ->line("Good news! Your donation has been picked up by volunteer {$this->volunteerName}.")
                ->line('It is now on the way to the receiver.')
                ->line('Thank you for your kindness 💚');
        }

        if ($notifiable->role === 'receiver') {
            return (new MailMessage)
                ->subject('Donation Picked Up and On Its Way 🚚')
                ->greeting('Hello!')
                ->line("Your donation is on the way! Volunteer {$this->volunteerName} has picked it up.")
                ->line('Be ready to receive the delivery.')
                ->line('Thank you for your patience 💚');
        }
    }

    public function toSms($notifiable)
    {
        if ($notifiable->role === 'donor') {
            return "Your donation has been picked up by {$this->volunteerName}. It’s on the way. Thank you for your support 💚";
        }

        if ($notifiable->role === 'receiver') {
            return "Delivery update: {$this->volunteerName} has picked up the donation. It’s on its way to you.";
        }
    }
}

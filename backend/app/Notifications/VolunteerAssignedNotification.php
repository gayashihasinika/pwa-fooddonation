<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Notifications\Channels\SmsChannel;

class VolunteerAssignedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public string $volunteerName
    ) {}

    public function via($notifiable)
    {
        return ['mail', SmsChannel::class];
    }

    /**
     * EMAIL CONTENT (ROLE BASED)
     */
    public function toMail($notifiable)
    {
        if ($notifiable->role === 'donor') {
            return (new MailMessage)
                ->subject('Volunteer Assigned to Your Donation')
                ->greeting('Hello Donor!')
                ->line("Good news! A volunteer ({$this->volunteerName}) has been assigned to deliver your donation.")
                ->line('Thank you for your generosity 💙');
        }

        if ($notifiable->role === 'receiver') {
            return (new MailMessage)
                ->subject('Volunteer Assigned for Your Delivery')
                ->greeting('Hello!')
                ->line("A volunteer ({$this->volunteerName}) has been assigned to deliver the items to you.")
                ->line('Please be available to receive the delivery.');
        }
    }

    /**
     * SMS CONTENT (ROLE BASED)
     */
    public function toSms($notifiable)
    {
        if ($notifiable->role === 'donor') {
    return "Your donation has a volunteer assigned! {$this->volunteerName} will pick it up soon. Thank you for your support 💙";
}

        if ($notifiable->role === 'receiver') {
            return "Delivery update: Volunteer {$this->volunteerName} will deliver the donation to you soon.";
        }
    }
}

<?php

namespace App\Notifications;

// backend/app/Notifications/DonationStatusNotification.php
// Notify all the receivers about donation is approved by admin
// Notify donor about donation is approved or rejected by admin

use App\Models\Donation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\VonageMessage;

class DonationStatusNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Donation $donation,
        public string $action // approved | rejected
    ) {}

    public function via($notifiable)
    {
        return ['mail', 'database']; // SMS handled separately (explained below)
    }

    public function toMail($notifiable)
{
    if ($this->action === 'approved') {
        return (new MailMessage)
            ->subject("Your Donation Has Been ✅ Approved")
            ->greeting("Hello {$notifiable->name},")
            ->line("Your donation **{$this->donation->title}** has been approved!")
            ->line("Pickup Address: {$this->donation->pickup_address}")
            ->line("Quantity: {$this->donation->quantity}")
            ->line("Thank you for supporting the community ❤️")
            ->salutation('— Food Donation Team');
    }

    if ($this->action === 'available') {
        return (new MailMessage)
            ->subject("🍽️ New Donation Available for Pickup!")
            ->greeting("Hello {$notifiable->name},")
            ->line("A new donation **{$this->donation->title}** is now available.")
            ->line("Pickup Address: {$this->donation->pickup_address}")
            ->line("Quantity: {$this->donation->quantity}")
            ->action(
                'View Donation',
                url("/receiver/donations/{$this->donation->id}")
            )
            ->line("Please log in to claim it.")
            ->salutation('— Food Donation Team');
    }

    // Safety fallback (never rejected)
    return (new MailMessage)
        ->subject("Donation Update")
        ->greeting("Hello {$notifiable->name},")
        ->line("There is an update regarding a donation.")
        ->salutation('— Food Donation Team');
}



public function toVonage($notifiable)
{
    if ($this->action === 'approved') {
        $message = "Your donation '{$this->donation->title}' has been APPROVED. Thank you!";
    } elseif ($this->action === 'available') {
        $message = "A new donation '{$this->donation->title}' is available for pickup! Check your account.";
    } else { // rejected
        $message = "Your donation '{$this->donation->title}' has been REJECTED.";
    }

    return (new VonageMessage())->content($message);
}



    public function toArray($notifiable)
    {
        return [
            'donation_id' => $this->donation->id,
            'status' => $this->action,
            'title' => $this->donation->title,
        ];
    }
}

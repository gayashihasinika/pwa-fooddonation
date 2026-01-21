<?php
// app/Http/Controllers/Admin/AdminDonationController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Notifications\DonationStatusNotification;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminDonationController extends Controller
{
    /**
     * Display a listing of all donations (for admin panel)
     */
    public function index()
    {
        $donations = Donation::with(['user:id,name,email', 'images'])
            ->select([
                'id',
                'user_id',
                'title',
                'quantity',
                'pickup_address',
                'expiry_date',
                'status',
                'created_at'
            ])
            ->latest()
            ->get();

        return response()->json([
            'donations' => $donations
        ]);
    }

    /**
     * Display the specified donation
     */
    public function show($id)
    {
        $donation = Donation::with(['user:id,name,email,phone', 'images'])
            ->findOrFail($id);

        return response()->json([
            'donation' => $donation
        ]);
    }

   public function approve($id, SmsService $sms)
{
    $donation = Donation::with('user')->findOrFail($id);

    if ($donation->status !== 'pending') {
        return response()->json([
            'error' => 'Only pending donations can be approved'
        ], 400);
    }

    $donation->update(['status' => 'approved']);

    // 🔔 Notify DONOR
    $donation->user->notify(
        new DonationStatusNotification($donation, 'approved')
    );

    if ($donation->user->phone) {
        $sms->send(
            $donation->user->phone,
            "Your donation '{$donation->title}' has been APPROVED. Thank you!"
        );
    }

    // 🔔 Notify RECEIVERS
    $receivers = \App\Models\User::where('role', 'receiver')->get();

    foreach ($receivers as $receiver) {
        $receiver->notify(
            new DonationStatusNotification($donation, 'available')
        );

        if ($receiver->phone) {
            $sms->send(
                $receiver->phone,
                "New donation '{$donation->title}' available. Log in to claim it!"
            );
        }
    }

    return response()->json([
        'message' => 'Donation approved and notifications sent',
        'donation' => $donation->fresh()
    ]);
}



public function reject($id, SmsService $sms)
{
    $donation = Donation::with('user')->findOrFail($id);

    if ($donation->status !== 'pending') {
        return response()->json(['error' => 'Only pending donations can be rejected'], 400);
    }

    $donation->update(['status' => 'rejected']);

    $donation->user->notify(
        new DonationStatusNotification($donation, 'rejected')
    );

    if ($donation->user->phone) {
        $sms->send(
            $donation->user->phone,
            "Your donation '{$donation->title}' was REJECTED. Please review details."
        );
    }

    return response()->json([
        'message' => 'Donation rejected and donor notified',
        'donation' => $donation->fresh()
    ]);
}

    /**
     * Permanently delete a donation (including images)
     */
    public function destroy($id)
    {
        $donation = Donation::findOrFail($id);

        // Delete associated images from storage
        foreach ($donation->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        }

        $donation->delete();

        return response()->json([
            'message' => 'Donation deleted permanently'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Volunteers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Claim;
use App\Notifications\DonationPickedUpNotification;
use App\Notifications\DonationDeliveredNotification;
use Illuminate\Support\Facades\Log;


class AcceptedTasksController extends Controller
{
    public function acceptedTasks()
{
    $volunteerId = auth()->id();

    $tasks = Claim::with([
            'donation.images',
            'donation'
        ])
        ->where('volunteer_id', $volunteerId)
        ->whereIn('status', ['accepted', 'picked_up', 'delivered'])
        ->orderBy('claimed_at', 'desc')
        ->get()
        ->map(function ($claim) {
            return [
                'id' => $claim->id,
                'status' => $claim->status,
                'claimed_at' => $claim->claimed_at,
                'picked_up_at' => $claim->picked_up_at,
                'delivered_at' => $claim->delivered_at,

                'donation' => [
                    'id' => $claim->donation->id,
                    'title' => $claim->donation->title,
                    'quantity' => $claim->donation->quantity,
                    'pickup_address' => $claim->donation->pickup_address,
                    'expiry_date' => $claim->donation->expiry_date,
                    'category' => $claim->donation->category,
                    'images' => $claim->donation->images->map(
                        fn ($img) => $img->image_path
                    ),
                ],
            ];
        });

    return response()->json([
        'data' => $tasks
    ]);
}

public function show($id)
{
    $claim = Claim::with('donation')
        ->where('volunteer_id', auth()->id())
        ->whereIn('status', ['accepted', 'picked_up', 'delivered'])
        ->findOrFail($id);

    return response()->json([
        'id' => $claim->id,
        'status' => $claim->status,
        'donation' => [
            'title' => $claim->donation->title,
            'quantity' => $claim->donation->quantity,
            'pickup_address' => $claim->donation->pickup_address,
            'expiry_date' => $claim->donation->expiry_date,
            'category' => $claim->donation->category,
        ],
    ]);
}

public function markAsPickedUp($id)
{
    $claim = Claim::with(['donation.donor', 'receiver'])
        ->where('id', $id)
        ->where('volunteer_id', auth()->id())
        ->where('status', 'accepted')
        ->firstOrFail();

    $claim->update([
        'status' => 'picked_up',
        'picked_up_at' => now(),
    ]);

    $volunteer = auth()->user();
    $donor = $claim->donation?->donor;
    $receiver = $claim->receiver;

    $notification = new DonationPickedUpNotification($volunteer->name);

    Log::info('📦 Donation picked up – notifying users', [
        'claim_id' => $claim->id,
        'donor_id' => $donor?->id,
        'receiver_id' => $receiver?->id,
    ]);

    $donor?->notify($notification);
    $receiver?->notify($notification);

    return response()->json([
        'message' => 'Donation marked as picked up',
        'status' => $claim->status,
    ]);
}


public function markAsDelivered($id)
{
    $claim = Claim::with(['donation.donor', 'receiver'])
        ->where('id', $id)
        ->where('volunteer_id', auth()->id())
        ->where('status', 'picked_up')
        ->firstOrFail();

    $claim->update([
        'status' => 'delivered',
        'delivered_at' => now(),
    ]);

    $volunteer = auth()->user();
    $donor = $claim->donation?->donor;
    $receiver = $claim->receiver;

    $notification = new DonationDeliveredNotification($volunteer->name);

    Log::info('✅ Donation delivered – notifying users', [
        'claim_id' => $claim->id,
        'donor_id' => $donor?->id,
        'receiver_id' => $receiver?->id,
    ]);

    $donor?->notify($notification);
    $receiver?->notify($notification);

    return response()->json([
        'message' => 'Delivery completed',
        'status' => $claim->status,
    ]);
}



}

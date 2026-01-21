<?php

namespace App\Http\Controllers\Receivers;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Claim;
use Illuminate\Http\Request;
use App\Notifications\DonationClaimedNotification;

class ReceiverDonationController extends Controller
{
    public function index(Request $request)
    {
        $query = Donation::with(['images', 'user'])
            ->where('status', 'approved');

        // Only filter by expiry if it exists
        $query->where(function ($q) {
            $q->whereNull('expiry_date')
              ->orWhere('expiry_date', '>=', now()->format('Y-m-d'));
        });

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('pickup_address', 'like', "%{$search}%");
            });
        }

        // Category filter — use 'category' not 'food_category'
        if ($request->filled('category') && $request->category !== '') {
            $query->where('category', $request->category);
        }

        // Sorting
        $sort = $request->get('sort', 'newest');
        $query->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');

        $donations = $query->paginate(12);

        return response()->json([
            'data' => $donations->items(),
            'current_page' => $donations->currentPage(),
            'last_page' => $donations->lastPage(),
            'total' => $donations->total(),
        ]);
    }

    public function show($id)
{
    $user = auth()->user();

    if ($user->role !== 'receiver') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $donation = Donation::with(['images', 'user'])->findOrFail($id);

    $existingClaim = Claim::where('donation_id', $id)
        ->where('receiver_id', $user->id)
        ->whereIn('status', ['pending', 'accepted'])
        ->first();

    return response()->json([
        'donation' => $donation,
        'already_claimed' => !!$existingClaim,
        'claim_status' => $existingClaim?->status,
    ]);
}



public function claim(Request $request, $id)
{
    $receiver = auth()->user();

    $donation = Donation::with('user')->findOrFail($id);

    if ($donation->user_id === $receiver->id) {
        return response()->json([
            'message' => 'You cannot claim your own donation'
        ], 403);
    }

    $alreadyClaimed = Claim::where('donation_id', $id)
        ->where('receiver_id', $receiver->id)
        ->whereIn('status', ['pending', 'accepted'])
        ->exists();

    if ($alreadyClaimed) {
        return response()->json([
            'message' => 'You already claimed this donation'
        ], 409);
    }

    $claim = Claim::create([
        'donation_id' => $id,
        'receiver_id' => $receiver->id,
        'status' => 'pending',
        'claimed_at' => now(),
    ]);

    /* 🔔 NOTIFY DONOR */
    $donor = $donation->user;

    \Log::info('🔔 Donation claimed', [
        'donor_id' => $donor->id,
        'phone' => $donor->phone,
    ]);

    $donor->notify(
        new DonationClaimedNotification($donation, $receiver)
    );

    return response()->json([
        'message' => 'Donation claimed successfully',
        'claim' => $claim
    ], 201);
}



}

<?php

namespace App\Http\Controllers\Volunteers;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\VolunteerAssignedNotification;

class DeliveryTaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Claim::with(['donation.images', 'receiver'])
            ->where('status', 'accepted')
            ->whereNull('volunteer_id');

        // 🔍 Filters
        if ($request->filled('category')) {
            $query->whereHas('donation', fn ($q) =>
                $q->where('category', $request->category)
            );
        }

        if ($request->filled('min_quantity')) {
            $query->whereHas('donation', fn ($q) =>
                $q->where('quantity', '>=', $request->min_quantity)
            );
        }

        if ($request->filled('expiry')) {
            $query->whereHas('donation', fn ($q) =>
                $q->orderBy('expiry_date', $request->expiry)
            );
        }

        return response()->json(
            $query->latest()->paginate(10)
        );
    }


public function accept(Claim $claim)
{
    if ($claim->volunteer_id) {
        return response()->json([
            'message' => 'This delivery task is already assigned to another volunteer.'
        ], 409);
    }

    $claim->update([
        'volunteer_id' => Auth::id(),
        'status' => 'picked_up',
        'picked_up_at' => now(),
    ]);

    $volunteer = Auth::user();

    $claim->load(['donation.donor', 'receiver']);

$donor = $claim->donation?->donor;
$receiver = $claim->receiver;


    $notification = new VolunteerAssignedNotification($volunteer->name);

    // ✅ LOG MUST BE INSIDE METHOD
    \Log::info('🔔 Sending VolunteerAssignedNotification', [
        'claim_id' => $claim->id,
        'donor_id' => $donor?->id,
        'receiver_id' => $receiver?->id,
    ]);

    $donor?->notify($notification);
    $receiver?->notify($notification);

    return response()->json([
        'message' => 'Delivery task accepted. Donor and receiver have been notified successfully.'
    ]);
}



    public function show($id)
{
    $claim = Claim::with('donation.images')->findOrFail($id);

    return response()->json([
        'id' => $claim->id,
        'status' => $claim->status,
        'donation' => [
            'title' => $claim->donation->title,
            'quantity' => $claim->donation->quantity,
            'pickup_address' => $claim->donation->pickup_address,
            'expiry_date' => $claim->donation->expiry_date,
            'category' => $claim->donation->category,
            'images' => $claim->donation->images->pluck('image_path'),
        ],
    ]);
}

}

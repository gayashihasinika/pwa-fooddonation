<?php

namespace App\Http\Controllers\Volunteers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Claim;

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


}

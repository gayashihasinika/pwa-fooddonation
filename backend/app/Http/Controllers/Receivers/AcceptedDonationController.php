<?php

// app/Http/Controllers/Receivers/AcceptedDonationController.php

namespace App\Http\Controllers\Receivers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;

class AcceptedDonationController extends Controller
{
    public function index(Request $request)
    {
        $claims = Claim::with([
                'donation.images'
            ])
            ->where('receiver_id', $request->user()->id)
            ->latest()
            ->get();

        $data = $claims->map(function ($claim) {
            return [
                'id' => $claim->donation->id,
                'title' => $claim->donation->title,
                'quantity' => $claim->donation->quantity,
                'pickup_address' => $claim->donation->pickup_address,
                'claimed_at' => $claim->created_at,
                'status' => $claim->status,
                'images' => $claim->donation->images,
            ];
        });

        return response()->json([
            'data' => $data
        ]);
    }
}

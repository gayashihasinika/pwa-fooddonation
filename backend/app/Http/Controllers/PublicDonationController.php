<?php

namespace App\Http\Controllers;

use App\Models\Donation;

class PublicDonationController extends Controller
{
    public function show($id)
    {
        $donation = Donation::with('images:id,donation_id,image_path')
            ->where('id', $id)
            ->where('status', 'approved') // Only show approved donations publicly
            ->first();

        if (!$donation) {
            return response()->json([
                'message' => 'Donation not found or not available'
            ], 404);
        }

        // Get donor name from user relationship (not donor)
        $donorName = $donation->user?->name ?? 'Anonymous Donor';

        return response()->json([
            'id' => $donation->id,
            'title' => $donation->title,
            'description' => $donation->description,
            'quantity' => $donation->quantity,
            'pickup_address' => $donation->pickup_address,
            'pickup_time' => $donation->preferred_pickup_time, // if you have this column
            'expiry_date' => $donation->expiry_date,
            'images' => $donation->images,
            'donor' => [
                'name' => $donorName,
            ],
            'created_at' => $donation->created_at,
        ]);
    }
}
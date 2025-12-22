<?php

namespace App\Http\Controllers\Receivers;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class ReceiverClaimDonationController extends Controller
{
    public function index(): JsonResponse
    {
        $receiverId = Auth::id();

        $donations = Donation::with(['images', 'user:id,name', 'claims']) // ← Add 'claims'
    ->whereHas('claims', function ($query) use ($receiverId) {
        $query->where('receiver_id', $receiverId)
              ->where('status', 'accepted');
    })
    ->get();

        return response()->json([
            'donations' => $donations
        ]);
    }

    public function show($id): JsonResponse
{
    $receiverId = Auth::id();

    $donation = Donation::with(['images', 'user:id,name', 'claims' => function ($query) use ($receiverId) {
        $query->where('receiver_id', $receiverId)
              ->where('status', 'accepted');
    }])
    ->whereHas('claims', function ($query) use ($receiverId) {
        $query->where('receiver_id', $receiverId)
              ->where('status', 'accepted');
    })
    ->findOrFail($id);

    // Ensure claims is always an array with the correct claim
    return response()->json([
        'donation' => $donation
    ]);
}
}
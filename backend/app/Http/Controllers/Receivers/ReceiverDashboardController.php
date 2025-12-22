<?php

namespace App\Http\Controllers\Receivers;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ReceiverDashboardController extends Controller
{
    public function donations(): JsonResponse
    {
        $receiverId = Auth::id();

        $claims = Claim::with(['donation.images', 'donation.user'])
            ->where('receiver_id', $receiverId)
            ->latest()
            ->get();

        $donations = $claims->map(function ($claim) {
            $donation = $claim->donation;
            return [
                'id' => $donation->id, // Use donation ID for navigation
                'title' => $donation->title,
                'quantity' => $claim->quantity ?? $donation->quantity, // Use claimed quantity if exists
                'pickup_address' => $donation->pickup_address,
                'status' => $claim->status,
                'created_at' => $claim->created_at,
                'images' => $donation->images,
                'user' => $donation->user ? ['name' => $donation->user->name] : null,
            ];
        });

        return response()->json([
            'donations' => $donations
        ]);
    }

    public function stats(): JsonResponse
    {
        $receiverId = Auth::id();

        $totalRequests = Claim::where('receiver_id', $receiverId)->count();
        $approvedRequests = Claim::where('receiver_id', $receiverId)
            ->where('status', 'accepted')
            ->count();
        $pendingRequests = Claim::where('receiver_id', $receiverId)
            ->where('status', 'pending')
            ->count();
        $receivedRequests = Claim::where('receiver_id', $receiverId)
            ->where('status', 'delivered')
            ->count();

        return response()->json([
            'totalRequests' => $totalRequests,
            'approvedRequests' => $approvedRequests,
            'pendingRequests' => $pendingRequests,
            'receivedRequests' => $receivedRequests,
        ]);
    }
}
<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ClaimApprovedNotification;
use App\Notifications\ClaimCancelledNotification;

class DonorClaimController extends Controller
{
    // ===============================
    // List all claims for donor
    // ===============================
    public function index()
    {
        $donorId = Auth::id();

        if (!$donorId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $claims = Claim::with(['donation.user', 'donation.images', 'receiver'])
            ->whereHas('donation', function ($q) use ($donorId) {
                $q->where('user_id', $donorId);
            })
            ->latest()
            ->get();

        return response()->json(['claims' => $claims]);
    }

    // ===============================
    // View single claim
    // ===============================
    public function show($id)
    {
        $donorId = Auth::id();

        $claim = Claim::with(['donation.user', 'donation.images', 'receiver'])
            ->whereHas('donation', fn ($q) => $q->where('user_id', $donorId))
            ->findOrFail($id);

        return response()->json(['claim' => $claim]);
    }

    // ===============================
    // Approve claim
    // ===============================
    public function approve($id)
    {
        $donorId = Auth::id();

        $claim = Claim::with(['receiver', 'donation'])
            ->whereHas('donation', fn ($q) => $q->where('user_id', $donorId))
            ->findOrFail($id);

        // Update status
        $claim->update(['status' => 'accepted']);

        // 🔔 Notify receiver (EMAIL + DB + SMS)
        $claim->receiver->notify(
            new ClaimApprovedNotification($claim)
        );

        return response()->json([
            'message' => 'Claim approved successfully',
            'claim'   => $claim,
        ]);
    }

    // ===============================
    // Cancel claim
    // ===============================
    public function cancel($id)
    {
        $donorId = Auth::id();

        $claim = Claim::with(['receiver', 'donation'])
            ->whereHas('donation', fn ($q) => $q->where('user_id', $donorId))
            ->findOrFail($id);

        // Update status
        $claim->update(['status' => 'cancelled']);

        // 🔔 Notify receiver (EMAIL + DB + SMS)
        $claim->receiver->notify(
            new ClaimCancelledNotification($claim)
        );

        return response()->json([
            'message' => 'Claim cancelled',
            'claim'   => $claim,
        ]);
    }
}

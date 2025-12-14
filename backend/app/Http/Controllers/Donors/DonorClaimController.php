<?php
// backend/app/Http/Controllers/Donors/DonorClaimController.php
namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DonorClaimController extends Controller
{
    // List all claims related to the donor's donations
    public function index()
{
    try {
        $donorId = Auth::id();
        if (!$donorId) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $claims = Claim::with(['donation.user', 'donation.images', 'receiver'])
            ->whereHas('donation', function($q) use ($donorId) {
                $q->where('user_id', $donorId);
            })
            ->latest()
            ->get();

        return response()->json(['claims' => $claims]);
    } catch (\Throwable $e) {
        return response()->json([
            'message' => 'Server error',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
}

    // View single claim
    public function show($id)
    {
        $donorId = Auth::id();
        $claim = Claim::with(['donation.user', 'donation.images', 'receiver'])
            ->whereHas('donation', fn($q) => $q->where('user_id', $donorId))
            ->findOrFail($id);

        return response()->json(['claim' => $claim]);
    }

    // Approve claim
    public function approve($id)
    {
        $donorId = Auth::id();
        $claim = Claim::whereHas('donation', fn($q) => $q->where('user_id', $donorId))
            ->findOrFail($id);

        $claim->update(['status' => 'accepted']);

        return response()->json([
            'message' => 'Claim approved successfully',
            'claim' => $claim
        ]);
    }

    // Cancel claim
    public function cancel($id)
    {
        $donorId = Auth::id();
        $claim = Claim::whereHas('donation', fn($q) => $q->where('user_id', $donorId))
            ->findOrFail($id);

        $claim->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Claim cancelled',
            'claim' => $claim
        ]);
    }
}

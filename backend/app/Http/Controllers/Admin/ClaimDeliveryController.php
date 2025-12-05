<?php
// backend/app/Http/Controllers/Admin/ClaimDeliveryController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Http\Request;

class ClaimDeliveryController extends Controller
{
    public function index()
    {
        $claims = Claim::with(['donation.user', 'donation.images', 'receiver', 'volunteer'])
            ->withCount('donation')
            ->latest()
            ->get();

        return response()->json([
            'claims' => $claims
        ]);
    }

    public function show($id)
    {
        $claim = Claim::with(['donation.user', 'donation.images', 'receiver', 'volunteer'])
            ->findOrFail($id);

        return response()->json([
            'claim' => $claim
        ]);
    }

    // Assign or Reassign Volunteer
    public function assignVolunteer(Request $request, $claimId)
    {
        $request->validate([
            'volunteer_id' => 'required|exists:users,id'
        ]);

        $claim = Claim::findOrFail($claimId);
        $claim->volunteer_id = $request->volunteer_id;
        $claim->status = 'accepted';
        $claim->save();

        return response()->json([
            'message' => 'Volunteer assigned successfully',
            'claim' => $claim->load('volunteer')
        ]);
    }

    // Mark as Picked Up
    public function markPickedUp($claimId)
    {
        $claim = Claim::findOrFail($claimId);
        $claim->update([
            'status' => 'picked_up',
            'picked_up_at' => now()
        ]);

        return response()->json(['message' => 'Marked as picked up']);
    }

    // Mark as Delivered
    public function markDelivered($claimId)
    {
        $claim = Claim::findOrFail($claimId);
        $claim->update([
            'status' => 'delivered',
            'delivered_at' => now()
        ]);

        // Update donation status
        $claim->donation->update(['status' => 'completed']);

        return response()->json(['message' => 'Delivery completed!']);
    }

    // Resolve Dispute
    public function resolveDispute(Request $request, $claimId)
    {
        $request->validate(['notes' => 'required|string']);

        $claim = Claim::findOrFail($claimId);
        $claim->update([
            'status' => 'disputed',
            'notes' => $request->notes
        ]);

        return response()->json(['message' => 'Dispute recorded']);
    }

    // Cancel Claim
    public function cancel($claimId)
    {
        $claim = Claim::findOrFail($claimId);
        $claim->update(['status' => 'cancelled', 'volunteer_id' => null]);

        return response()->json(['message' => 'Claim cancelled']);
    }
}
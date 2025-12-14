<?php
// backend/app/Http/Controllers/Receivers/ReceiverDashboardController.php
namespace App\Http\Controllers\Receivers;

use App\Http\Controllers\Controller;
use App\Models\Claim;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReceiverDashboardController extends Controller
{
    // Get all donations claimed by the receiver
    public function donations()
    {
        $receiverId = Auth::id();

        $donations = Claim::with(['donation'])
            ->where('receiver_id', $receiverId)
            ->latest()
            ->get()
            ->map(function ($claim) {
                return [
                    'id' => $claim->id,
                    'title' => $claim->donation->title,
                    'quantity' => $claim->donation->quantity,
                    'pickup_address' => $claim->donation->pickup_address,
                    'status' => $claim->status,
                    'created_at' => $claim->created_at->toDateTimeString(),
                ];
            });

        return response()->json([
            'donations' => $donations
        ]);
    }

    // Get dashboard stats for receiver
    public function stats()
    {
        $receiverId = Auth::id();

        $totalRequests = Claim::where('receiver_id', $receiverId)->count();
        $approvedRequests = Claim::where('receiver_id', $receiverId)
            ->where('status', 'approved')->count();
        $pendingRequests = Claim::where('receiver_id', $receiverId)
            ->where('status', 'pending')->count();

        return response()->json([
            'totalRequests' => $totalRequests,
            'approvedRequests' => $approvedRequests,
            'pendingRequests' => $pendingRequests,
        ]);
    }
}

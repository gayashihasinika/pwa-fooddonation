<?php

namespace App\Http\Controllers\Receivers;
use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DonationController extends Controller
{
    // Fetch receiver donations
    public function myDonations()
    {
        $user = Auth::user();

        // Assuming receiver requests are stored by user_id
        $donations = Donation::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($donations);
    }

    // Fetch dashboard stats
    public function dashboardStats()
    {
        $user = Auth::user();

        $total = Donation::where('user_id', $user->id)->count();
        $approved = Donation::where('user_id', $user->id)
            ->where('status', 'approved')
            ->count();
        $pending = Donation::where('user_id', $user->id)
            ->where('status', 'pending')
            ->count();

        return response()->json([
            'totalRequests' => $total,
            'approvedRequests' => $approved,
            'pendingRequests' => $pending,
        ]);
    }

}
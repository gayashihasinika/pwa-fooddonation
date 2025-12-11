<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Donation;
use App\Models\UserPoint;
use App\Models\UserBadge;
use App\Models\Badge;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        // ================== Stats ==================
        $totalUsers = User::count();
        $totalDonors = User::where('role', 'donor')->count();
        $totalVolunteers = User::where('role', 'volunteer')->count();
        $totalReceivers = User::where('role', 'receiver')->count();

        $totalDonations = Donation::count();
        $pendingDonations = Donation::where('status', 'pending')->count();
        $claimedDonations = Donation::where('status', 'approved')->count();
        $deliveredDonations = Donation::where('status', 'completed')->count();
        $wastedDonations = Donation::where('status', 'rejected')->count();
        $todayDonations = Donation::whereDate('created_at', $today)->count();

        // ================== Donation Trend (Last 7 days) ==================
        $donationTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $donationTrend[] = [
                'name' => $date->format('D'),
                'donations' => Donation::whereDate('created_at', $date)->count(),
            ];
        }

        // ================== Role Distribution ==================
        $roleDistribution = [
            ['name' => 'Donors', 'value' => $totalDonors, 'color' => '#f43f5e'],
            ['name' => 'Volunteers', 'value' => $totalVolunteers, 'color' => '#fb923c'],
            ['name' => 'Receivers', 'value' => $totalReceivers, 'color' => '#fbbf24'],
        ];

        // ================== Top Donors ==================
        $topDonors = User::where('role', 'donor')
            ->withSum('donations', 'quantity') // sum of donations quantity
            ->with('points:id,user_id,points') // fetch points
            ->get()
            ->map(function($user, $index) {
                return [
                    'rank' => $index + 1,
                    'name' => $user->organization ?? $user->name,
                    'donations' => $user->donations_sum_quantity ?? 0,
                    'points' => $user->points->points ?? 0,
                ];
            })
            ->sortByDesc('points')
            ->take(5)
            ->values();

        // ================== Recent Activity ==================
        $recentDonations = Donation::latest()->take(5)->get();
        $recentActivity = $recentDonations->map(function($donation) {
            return [
                'id' => $donation->id,
                'action' => 'posted a donation',
                'user' => $donation->user->name ?? 'Unknown',
                'time' => $donation->created_at->diffForHumans(),
                'type' => 'donation',
            ];
        });

        return response()->json([
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalDonors' => $totalDonors,
                'totalVolunteers' => $totalVolunteers,
                'totalReceivers' => $totalReceivers,
                'totalDonations' => $totalDonations,
                'pendingDonations' => $pendingDonations,
                'claimedDonations' => $claimedDonations,
                'deliveredDonations' => $deliveredDonations,
                'wastedDonations' => $wastedDonations,
                'todayDonations' => $todayDonations,
            ],
            'donationTrend' => $donationTrend,
            'roleDistribution' => $roleDistribution,
            'topDonors' => $topDonors,
            'recentActivity' => $recentActivity,
        ]);
    }
}

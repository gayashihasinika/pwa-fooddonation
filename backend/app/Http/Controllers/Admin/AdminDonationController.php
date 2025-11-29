<?php
// app/Http/Controllers/Admin/AdminDonationController.php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminDonationController extends Controller
{
    /**
     * Display a listing of all donations (for admin panel)
     */
    public function index()
    {
        $donations = Donation::with(['user:id,name,email', 'images'])
            ->select([
                'id',
                'user_id',
                'title',
                'quantity',
                'pickup_address',
                'expiry_date',
                'status',
                'created_at'
            ])
            ->latest()
            ->get();

        return response()->json([
            'donations' => $donations
        ]);
    }

    /**
     * Display the specified donation
     */
    public function show($id)
    {
        $donation = Donation::with(['user:id,name,email,phone', 'images'])
            ->findOrFail($id);

        return response()->json([
            'donation' => $donation
        ]);
    }

    /**
     * Approve a pending donation
     */
    public function approve($id)
    {
        $donation = Donation::findOrFail($id);

        if ($donation->status !== 'pending') {
            return response()->json([
                'error' => 'Only pending donations can be approved'
            ], 400);
        }

        $donation->update(['status' => 'approved']);

        return response()->json([
            'message' => 'Donation approved successfully',
            'donation' => $donation->fresh()
        ]);
    }

    /**
     * Reject a suspicious donation (keeps it visible but marked)
     */
    public function reject($id)
    {
        $donation = Donation::findOrFail($id);

        if ($donation->status !== 'pending') {
            return response()->json([
                'error' => 'Only pending donations can be rejected'
            ], 400);
        }

        $donation->update(['status' => 'rejected']);

        return response()->json([
            'message' => 'Donation rejected (marked as suspicious)',
            'donation' => $donation->fresh()
        ]);
    }

    /**
     * Permanently delete a donation (including images)
     */
    public function destroy($id)
    {
        $donation = Donation::findOrFail($id);

        // Delete associated images from storage
        foreach ($donation->images as $image) {
            if (Storage::disk('public')->exists($image->image_path)) {
                Storage::disk('public')->delete($image->image_path);
            }
            $image->delete();
        }

        $donation->delete();

        return response()->json([
            'message' => 'Donation deleted permanently'
        ]);
    }
}
<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\DonationImage;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function index(Request $request)
{
    $userId = $request->query('user_id');
    if (!$userId) {
        return response()->json(['message' => 'user_id is required'], 400);
    }

    $donations = Donation::with('images')
        ->where('user_id', $userId)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($donations);
}


    // Show a single donation
    public function show($id)
    {
        $donation = Donation::with('images')->findOrFail($id);
        return response()->json($donation);
    }

    // Create donation - returns data if needed for form
    public function create()
    {
        // Normally for API, you don't need this
        return response()->json(['message' => 'Return any required form data here']);
    }

    // Store new donation
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'pickup_address' => 'required|string|max:255',
            'expiry_date' => 'nullable|date',
            'status' => 'nullable|string|in:pending,approved,completed',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $donation = Donation::create($request->only([
            'user_id',
            'title',
            'description',
            'quantity',
            'pickup_address',
            'expiry_date',
            'status',
        ]));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('donations', 'public');
                DonationImage::create([
                    'donation_id' => $donation->id,
                    'image_path' => $path,
                ]);
            }
        }

        return response()->json($donation->load('images'), 201);
    }

    // Edit donation - return donation data
    public function edit($id)
    {
        $donation = Donation::with('images')->findOrFail($id);
        return response()->json($donation);
    }

    // Update donation
    public function update(Request $request, $id)
    {
        $donation = Donation::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'pickup_address' => 'required|string|max:255',
            'expiry_date' => 'nullable|date',
            'status' => 'nullable|string|in:pending,approved,completed',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $donation->update($request->only([
            'title',
            'description',
            'quantity',
            'pickup_address',
            'expiry_date',
            'status',
        ]));

        // Optional: handle new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('donations', 'public');
                DonationImage::create([
                    'donation_id' => $donation->id,
                    'image_path' => $path,
                ]);
            }
        }

        return response()->json($donation->load('images'));
    }

    // Delete donation
    public function destroy($id)
    {
        $donation = Donation::findOrFail($id);

        // Delete images from storage
        foreach ($donation->images as $img) {
            \Storage::disk('public')->delete($img->image_path);
            $img->delete();
        }

        $donation->delete();

        return response()->json(['message' => 'Donation deleted successfully']);
    }
}

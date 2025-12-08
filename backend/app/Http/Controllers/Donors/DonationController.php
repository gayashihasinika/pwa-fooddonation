<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\DonationImage;
use Illuminate\Support\Facades\Auth;
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
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'quantity' => 'required|integer|min:1',
        'pickup_address' => 'required|string|max:255',
        'expiry_date' => 'nullable|date',
        'preferred_pickup_time' => 'nullable|date_format:H:i',
        'food_category' => 'nullable|in:rice,bread,packaged,event_food,curry,other',
        'allergy_tags' => 'nullable|array',
        'allergy_tags.*' => 'string',
        'freshness_level' => 'nullable|in:freshly_cooked,yesterdays_leftover,packaged_sealed',
        'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $donation = Donation::create($validated);

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
    
    // Convert JSON allergy_tags back to array
    if ($donation->allergy_tags) {
        $donation->allergy_tags = json_decode($donation->allergy_tags, true);
    }

    return response()->json($donation);
}

    // Update donation
    public function update(Request $request, $id)
{
    $donation = Donation::with('images')->findOrFail($id);

    $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'nullable|string',
        'quantity' => 'required|integer|min:1',
        'pickup_address' => 'required|string|max:255',
        'expiry_date' => 'nullable|date',
        'preferred_pickup_time' => 'nullable|string',
        'food_category' => 'nullable|string|in:rice,bread,packaged,event_food,curry,other',
        'freshness_level' => 'nullable|string|in:freshly_cooked,yesterdays_leftover,packaged_sealed',
        'allergy_tags' => 'nullable|array',
        'allergy_tags.*' => 'string|in:nuts,dairy,gluten,eggs,soy,seafood',
        'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'existing_images' => 'nullable|array',
        'existing_images.*' => 'integer|exists:donation_images,id',
    ]);

    // Update donation fields
    $donation->update([
        'title' => $request->title,
        'description' => $request->description,
        'quantity' => $request->quantity,
        'pickup_address' => $request->pickup_address,
        'expiry_date' => $request->expiry_date,
        'preferred_pickup_time' => $request->preferred_pickup_time,
        'food_category' => $request->food_category,
        'freshness_level' => $request->freshness_level,
        'allergy_tags' => $request->filled('allergy_tags') ? json_encode($request->allergy_tags) : null,
    ]);

    // Handle image deletion
    $keepImageIds = $request->input('existing_images', []);
    $donation->images()->whereNotIn('id', $keepImageIds)->each(function ($image) {
        \Storage::disk('public')->delete($image->image_path);
        $image->delete();
    });

    // Handle new images
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $path = $file->store('donations', 'public');
            DonationImage::create([
                'donation_id' => $donation->id,
                'image_path' => $path,
            ]);
        }
    }

    return response()->json([
        'message' => 'Donation updated successfully!',
        'donation' => $donation->load('images')
    ]);
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

    public function myDonations(Request $request)
{
    $user = $request->user(); // Authenticated user

    if (!$user) {
        return response()->json(['message' => 'Unauthenticated'], 401);
    }

    $donations = Donation::with('images')
        ->where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->get();

    return response()->json($donations);
}

}

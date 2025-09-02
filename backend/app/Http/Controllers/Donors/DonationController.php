<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;

class DonationController extends Controller
{
   public function index(Request $request)
{
    $userId = $request->query('user_id');

    $donations = Donation::with('images')
        ->where('user_id', $userId)
        ->get();

    return response()->json($donations);
}
    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'pickup_address' => 'required|string|max:255',
            'status' => 'nullable|string|in:pending,approved,completed',
        ]);

        $donation = Donation::create($request->all());

        return response()->json($donation, 201);
    }

}

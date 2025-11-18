<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Donor Controllers
use App\Http\Controllers\Donors\DonationController;
use App\Http\Controllers\Donors\LeaderboardController;

// Receiver Controllers
use App\Http\Controllers\Receivers\DonationController as ReceiverDonationController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'Hello from Laravel API 🚀'
    ]);
});
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected route to get current user
Route::middleware('auth:sanctum')->get('/users/me', function (Request $request) {
    return response()->json($request->user());
});

Route::get('/translations/{lang}', function ($lang) {
    App::setLocale($lang);
    return response()->json(trans('messages'));
});


// Donor-specific routes
Route::prefix('donations')->group(function () {
    Route::get('/', [DonationController::class, 'index']);          // GET /api/donations?user_id=1
    Route::get('/{id}', [DonationController::class, 'show']);       // GET /api/donations/{id}
    Route::post('/', [DonationController::class, 'store']);         // POST /api/donations
    Route::put('/{id}', [DonationController::class, 'update']);     // PUT /api/donations/{id}
    Route::delete('/{id}', [DonationController::class, 'destroy']); // DELETE /api/donations/{id}
});

//my-donation routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-donations', [DonationController::class, 'myDonations']);
});

Route::get('/donor-leaderboard', [LeaderboardController::class, 'index']);



// Receiver-specific routes
Route::middleware('auth:sanctum')->group(function () {
    // Receiver-specific donations
    Route::get('/receiver-donations', [ReceiverDonationController::class, 'myDonations']);

    // Receiver stats for dashboard
    Route::get('/receiver-dashboard-stats', [ReceiverDonationController::class, 'dashboardStats']);
});

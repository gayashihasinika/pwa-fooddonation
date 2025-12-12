<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Donor Controllers
use App\Http\Controllers\Donors\DonationController;
use App\Http\Controllers\Donors\LeaderboardController;
use App\Http\Controllers\Donors\GamificationController as DonorGamificationController;
use App\Http\Controllers\Donors\DonorDashboardController;
use App\Http\Controllers\Donors\StreakController;

// Receiver Controllers
use App\Http\Controllers\Receivers\DonationController as ReceiverDonationController;

// Admin Controllers
use App\Http\Controllers\Admin\AdminDonationController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\ClaimDeliveryController;
use App\Http\Controllers\Admin\AdminGamificationController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminChallengeProgressController;
use App\Http\Controllers\Admin\AdminStreakController;

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


// Admin Routes 
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [AdminDashboardController::class, 'index']);

    // User Management
    Route::get('/users', [AdminUserController::class, 'index']);                    // List all users
    Route::get('/users/{id}', [AdminUserController::class, 'show']);                 // View single user
    Route::post('/users', [AdminUserController::class, 'store']);                   // Add new user (manual)
    Route::put('/users/{id}', [AdminUserController::class, 'update']);              // Edit user
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);          // Delete user

    // Actions
    Route::post('/users/{id}/suspend', [AdminUserController::class, 'suspend']);    // Suspend
    Route::post('/users/{id}/unsuspend', [AdminUserController::class, 'unsuspend']); // Unsuspend
    Route::post('/users/{id}/verify', [AdminUserController::class, 'verify']);      // Verify user/NGO
    Route::post('/users/{id}/reset-password', [AdminUserController::class, 'resetPassword']); // Reset password

    // Donation Management
    Route::get('/donations', [AdminDonationController::class, 'index']);                    // List all donations
    Route::get('/donations/{id}', [AdminDonationController::class, 'show']);                 // View single donation
    Route::delete('/donations/{id}', [AdminDonationController::class, 'destroy']);          // Delete donation
    Route::post('/donations/{id}/approve', [AdminDonationController::class, 'approve']);
    Route::post('/donations/{id}/reject', [AdminDonationController::class, 'reject']);

    // Claim Delivery Management
    Route::get('/claims', [ClaimDeliveryController::class, 'index']);
    Route::get('/claims/{id}', [ClaimDeliveryController::class, 'show']);
    Route::post('/claims/{id}/assign-volunteer', [ClaimDeliveryController::class, 'assignVolunteer']);
    Route::post('/claims/{id}/picked-up', [ClaimDeliveryController::class, 'markPickedUp']);
    Route::post('/claims/{id}/delivered', [ClaimDeliveryController::class, 'markDelivered']);
    Route::post('/claims/{id}/dispute', [ClaimDeliveryController::class, 'resolveDispute']);
    Route::post('/claims/{id}/cancel', [ClaimDeliveryController::class, 'cancel']);

    //Gamification Management
    Route::get('/gamification', [AdminGamificationController::class, 'index']);
    Route::post('/gamification/badge', [AdminGamificationController::class, 'storeBadge']);
    Route::put('/gamification/badge/{id}', [AdminGamificationController::class, 'updateBadge']);
    Route::post('/gamification/config', [AdminGamificationController::class, 'updateConfig']);
    Route::post('/gamification/challenge', [AdminGamificationController::class, 'createChallenge']);
    Route::put('/gamification/challenge/{id}', [AdminGamificationController::class, 'updateChallenge']);
    Route::delete('/gamification/badge/{id}', [AdminGamificationController::class, 'destroy']);

    // Donors who earned a specific badge
    Route::get('/gamification/earned', [AdminGamificationController::class, 'earnedBadges']);
    Route::get('/gamification/earned-challenges', [AdminGamificationController::class, 'earnedChallenges']);

    // Challenge Progress
    Route::get('/challenge-progress', [AdminChallengeProgressController::class, 'index']);

    // Streak Leaderboard
    Route::get('/streaks', [AdminStreakController::class, 'index']);
    Route::get('/streaks/leaderboard', [AdminStreakController::class, 'leaderboard']);

});


// Donor-specific routes
Route::middleware('auth:sanctum')->prefix('donors')->group(function () {
     Route::get('/dashboard', [DonorDashboardController::class, 'index']);

// Donor management of donations
Route::prefix('donations')->group(function () {
    Route::get('/', [DonationController::class, 'index']);          // GET /api/donations?user_id=1
    Route::get('/{id}', [DonationController::class, 'show']);       // GET /api/donations/{id}
    Route::post('/', [DonationController::class, 'store']);         // POST /api/donations
    Route::put('/{id}', [DonationController::class, 'update']);     // PUT /api/donations/{id}
    Route::delete('/{id}', [DonationController::class, 'destroy']); // DELETE /api/donations/{id}
});

//my-donation routes
    Route::get('/my-donations', [DonationController::class, 'myDonations']);
    

Route::get('/donor-leaderboard', [LeaderboardController::class, 'index']);

// Gamification routes for donors
Route::prefix('gamification')->group(function () {
    Route::get('/', [DonorGamificationController::class, 'index']);               // Get points and badges
    Route::post('/check-and-assign', [DonorGamificationController::class, 'checkAndAssign']); // Check & assign new badges
});

// Challenges
Route::get('/challenges', [DonorGamificationController::class, 'getChallenges']);
    Route::post('/challenges/{id}/complete', [DonorGamificationController::class, 'completeChallenge']);

    // Streak routes
    Route::get('/streak', [StreakController::class, 'show']);
    Route::post('/streaks/process', [StreakController::class, 'process']);

});



// Receiver-specific routes
Route::middleware('auth:sanctum')->group(function () {
    // Receiver-specific donations
    Route::get('/receiver-donations', [ReceiverDonationController::class, 'myDonations']);

    // Receiver stats for dashboard
    Route::get('/receiver-dashboard-stats', [ReceiverDonationController::class, 'dashboardStats']);
});

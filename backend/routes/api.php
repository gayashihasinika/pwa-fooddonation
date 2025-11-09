<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Donors\DonationController;

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



Route::prefix('donations')->group(function () {
    Route::get('/', [DonationController::class, 'index']);          // GET /api/donations?user_id=1
    Route::get('/{id}', [DonationController::class, 'show']);       // GET /api/donations/{id}
    Route::post('/', [DonationController::class, 'store']);         // POST /api/donations
    Route::put('/{id}', [DonationController::class, 'update']);     // PUT /api/donations/{id}
    Route::delete('/{id}', [DonationController::class, 'destroy']); // DELETE /api/donations/{id}
});
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Donors\UserController;
use App\Http\Controllers\Donors\DonationController;
use App\Http\Controllers\Donors\VolunteerController;

Route::get('/volunteer-matches', [VolunteerController::class, 'userMatches']);


Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Laravel backend 🚀'
    ]);
});


Route::prefix('donors')->group(function () {
    Route::get('/user', [UserController::class, 'currentUser']);
    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store']);
    Route::get('/volunteer-matches', [VolunteerController::class, 'userMatches']);
});

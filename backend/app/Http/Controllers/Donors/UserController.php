<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function currentUser()
    {
        $userEmail = session('userEmail') ?? 'gayashihasinika@gmail.com';
        $user = User::where('email', $userEmail)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        return response()->json($user);
    }
}

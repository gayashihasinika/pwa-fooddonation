<?php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use App\Models\VolunteerMatch;
use Illuminate\Http\Request;

class VolunteerController extends Controller
{
    public function userMatches(Request $request)
{
    $userId = $request->query('user_id');
    $matches = VolunteerMatch::with('donation')
        ->whereHas('donation', fn($q) => $q->where('user_id', $userId))
        ->get();

    return response()->json($matches);
}

}

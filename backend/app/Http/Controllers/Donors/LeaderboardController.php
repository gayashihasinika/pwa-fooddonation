<?php

// app/Http/Controllers/Donors/LeaderboardController.php

namespace App\Http\Controllers\Donors;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Donation;
use Illuminate\Support\Facades\DB;

class LeaderboardController extends Controller
{
    public function index()
    {
        // Example: rank donors by total quantity donated
        $donors = User::where('role', 'donor')
            ->select('id', 'name', 'email')
            ->withCount(['donations as total_quantity' => function($query) {
                $query->select(DB::raw("SUM(quantity)"));
            }])
            ->orderByDesc('total_quantity')
            ->get();

        return response()->json($donors);
    }
}

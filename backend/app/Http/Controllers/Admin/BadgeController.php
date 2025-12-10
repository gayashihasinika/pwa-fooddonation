<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use Illuminate\Http\Request;

class BadgeController extends Controller
{
    public function index()
    {
        return Badge::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:badges',
            'title' => 'required',
            'category' => 'required',
            'tier' => 'required|integer|min:1',
            'rarity' => 'required',
            'points_reward' => 'required|integer|min:0',
        ]);

        $badge = Badge::create($validated);

        return response()->json(['message' => 'Badge created', 'badge' => $badge]);
    }

    public function show($id)
    {
        return Badge::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $badge = Badge::findOrFail($id);
        $badge->update($request->all());
        return response()->json(['message' => 'Badge updated', 'badge' => $badge]);
    }

    public function destroy($id)
    {
        $badge = Badge::findOrFail($id);
        $badge->delete();
        return response()->json(['message' => 'Badge deleted']);
    }
}

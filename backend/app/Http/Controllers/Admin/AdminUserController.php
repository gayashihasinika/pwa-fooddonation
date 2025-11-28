<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Optional filters
        if ($request->role) {
            $query->where('role', $request->role);
        }
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('organization', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->orderByDesc('created_at')->paginate(20);

        return response()->json($users);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'role' => ['required', Rule::in(['admin', 'donor', 'receiver', 'volunteer'])],
            'organization' => 'nullable|string|max:255',
            'password' => 'required|string|min:8|confirmed',
            'is_verified' => 'sometimes|boolean',
            'verification_note' => 'nullable|string'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'organization' => $validated['organization'] ?? null,
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'is_verified' => $validated['is_verified'] ?? 0,
            'verification_note' => $validated['verification_note'] ?? null,
            'email_verified_at' => now(), // optional: auto verify email
        ]);

        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'role' => ['sometimes', Rule::in(['admin', 'donor', 'receiver', 'volunteer'])],
            'organization' => 'nullable|string|max:255',
            'is_verified' => 'sometimes|boolean',
            'verification_note' => 'nullable|string'
        ]);

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth('sanctum')->id()) {
            return response()->json(['error' => 'You cannot delete yourself'], 400);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function suspend($id)
    {
        $user = User::findOrFail($id);

        if ($user->id === auth('sanctum')->id()) {
            return response()->json(['error' => 'You cannot suspend yourself'], 400);
        }

        $user->update(['is_suspended' => 1]);

        return response()->json(['message' => 'User suspended']);
    }

    public function unsuspend($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_suspended' => 0]);

        return response()->json(['message' => 'User unsuspended']);
    }

    public function verify(Request $request, $id)
    {
        $request->validate([
            'verification_note' => 'nullable|string'
        ]);

        $user = User::findOrFail($id);
        $user->update([
            'is_verified' => 1,
            'verification_note' => $request->verification_note
        ]);

        return response()->json(['message' => 'User/NGO verified successfully', 'user' => $user]);
    }

    
}
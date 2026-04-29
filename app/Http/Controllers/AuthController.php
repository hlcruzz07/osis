<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\HashingService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function __construct(protected HashingService $hashingService)
    {

    }
    public function index()
    {
        return Inertia::render('Admin/Auth/Login');
    }

    public function redirect()
    {

        return Socialite::driver('google')->redirect();
    }
    public function callback()
    {
        $googleUser = Socialite::driver('google')->user();

        try {

            $user = User::where('hashed_email', $this->hashingService->hashValue($googleUser->getEmail()))->first();

            if (!$user) {
                ActivityLog::log(
                    'login',
                    'unauthorized user login',
                    $googleUser->getEmail(),
                    request(),
                    'failed'
                );
                return redirect()->route('admin')->with('error', 'Invalid credentials');
            }


            $user->update([
                'name' => $googleUser->getName(),
                'avatar' => $googleUser->getAvatar(),
            ]);

            ActivityLog::log(
                'login',
                ($user->roles()->first()->name === 'super_admin' ? 'super admin' : 'admin') . ' has logged in',
                $user->email,
                request(),
                'success'
            );

            Auth::login($user);

            return redirect()->route('dashboard')->with('success', 'Welcome ' . $user->name);

        } catch (Exception $e) {

            ActivityLog::log(
                'login',
                'something went wrong to login the user: ' . $e->getMessage(),
                $googleUser->getEmail(),
                request(),
                'failed'
            );

            Log::error($e->getMessage());

            return redirect()->route('admin')->with('error', 'Something went wrong.');
        }
    }


    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $request->session()->flush();

        return redirect()->route('admin')->with('success', 'Logged out successfully');
    }
}

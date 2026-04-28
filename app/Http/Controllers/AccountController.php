<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\CreateAccountRequest;
use App\Models\User;
use App\Repositories\UserRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AccountController extends Controller
{
    public function __construct(protected UserRepo $userRepo)
    {
        //
    }

    public function index()
    {
        $permissions = cache()->remember('permissions', 60 * 60 * 24, fn() => Permission::all());

        $roles = cache()->remember('roles', 60 * 60 * 24, fn() => Role::all());

        return Inertia::render('Admin/Accounts/Index', [
            'permissions' => $permissions,
            'roles' => $roles
        ]);
    }

    public function create(CreateAccountRequest $request)
    {
        try {

            $this->userRepo->create($request->all());

            ActivityLog::log(
                'create',
                'added new account',
                Auth::user()->email,
                request(),
                'success'
            );

            return redirect()->route('accounts')->with('success', 'Account created successfully!');
        } catch (Exception $e) {

            ActivityLog::log(
                'create',
                'failed to add account' . $e->getMessage(),
                Auth::user()->email,
                request(),
                'failed'
            );

            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}

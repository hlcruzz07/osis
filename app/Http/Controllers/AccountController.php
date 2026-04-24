<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Repositories\UserRepo;
use Illuminate\Http\Request;
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
}

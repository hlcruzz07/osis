<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\CreateAccountRequest;
use App\Http\Requests\UpdateAccountRequest;
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
        $roles = cache()->remember('roles', 600, fn() => Role::all());

        return Inertia::render('Admin/Accounts/Index', [
            
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

            return redirect()->back()->with('success', 'Account created successfully!');
        } catch (Exception $e) {

            ActivityLog::log(
                'create',
                'failed to add account: ' . $e->getMessage(),
                Auth::user()->email,
                request(),
                'failed'
            );

            return redirect()->back()->with('error', 'Something went wrong, please try again.');
        }
    }

    public function update(UpdateAccountRequest $request, int $id)
    {
        try {

            $this->userRepo->update($request->all(), $id);

            ActivityLog::log(
                'update',
                'updated account with an id number of: ' . $id,
                Auth::user()->email,
                request(),
                'success'
            );

            return redirect()->back()->with('success', 'Account updated successfully!');
        } catch (Exception $e) {

            ActivityLog::log(
                'update',
                'failed to update account: ' . $e->getMessage(),
                Auth::user()->email,
                request(),
                'failed'
            );

            return redirect()->back()->with('error', 'Something went wrong, please try again.');
        }
    }
}

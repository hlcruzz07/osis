<?php

namespace App\Http\Controllers;

use App\Facades\ActivityLog;
use App\Http\Requests\CreateRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Repositories\RoleRepo;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function __construct(protected RoleRepo $roleRepo)
    {
       
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render("Admin/RolesAndPermissions/Index",[
            "permissions"=> Permission::all(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CreateRoleRequest $request)
    {
        try {
            $role = $this->roleRepo->create($request->all());

            ActivityLog::log('create', 'created new role named: '. $role->name, Auth::user()->email, request(), 'success');

            return back()->with('success', 'Role created successfully');

        } catch (Exception $e) {

            Log::error($e->getMessage());
            
            ActivityLog::log('create', 'failed to create a new role: ' . $e->getMessage(), Auth::user()->email, request(), 'failed');

            return back()->with('error', 'Something went wrong.');
        }
        
    }


    public function update(UpdateRoleRequest $request, int $id)
    {
       try {
            $role = $this->roleRepo->update($request->all(), $id);

            ActivityLog::log('update', 'updated role with an id of: '. $role->id, Auth::user()->email, request(), 'success');

            return back()->with('success', 'Role updated successfully');

        } catch (Exception $e) {

            Log::error($e->getMessage());
            
            ActivityLog::log('update', 'failed to update role: ' . $e->getMessage(), Auth::user()->email, request(), 'failed');

            return back()->with('error', 'Something went wrong.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

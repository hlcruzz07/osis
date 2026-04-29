<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\RoleRepo;
use Exception;
use Illuminate\Http\Request;

class RoleApiController extends Controller
{
    public function __construct(protected RoleRepo $roleRepo)
    {
        //
    }
    public function paginate(Request $request)
    {
        try {
            $roles = $this->roleRepo->paginate($request->all());

            return response()->json($roles);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch roles',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

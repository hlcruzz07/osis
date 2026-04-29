<?php

namespace App\Repositories;

use App\Models\User;
use App\Services\HashingService;
use Carbon\Carbon;

class UserRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected User $model, protected HashingService $hashingService)
    {
        //
    }
    public function paginate(array $filters)
    {

        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('hashed_name', 'like', "%{$this->hashingService->hashValue($search)}%")
                    ->orWhere('hashed_email', 'like', "%{$this->hashingService->hashValue($search)}%")
                    ->orWhereHas('roles', function ($roleQuery) use ($search) {
                        $roleQuery->where('name', 'like', "%{$search}%");
                    });
            });

        }


        if (!empty($filters['created_at_from']) && !empty($filters['created_at_to'])) {
            if ($filters['created_at_from'] === $filters['created_at_to']) {
                $query->whereDate('created_at', '=', $filters['created_at_from']);
            } else {
                $query->whereBetween('created_at', [
                    $filters['created_at_from'],
                    $filters['created_at_to'],
                ]);
            }
        }

        $sort = $filters['sort'] ?? 'id';
        $order = $filters['order'] ?? 'desc';

        $query->orderBy($sort, $order);

        $show = $filters['show'] ?? 10;

        return $query->with(['roles','permissions'])->paginate($show);
    }


    public function create(array $data)
    {
        $user = $this->model->create([
            'name' => $data['name'],
            'hashed_name' => $this->hashingService->hashValue($data['name']),
            'email' => $data['email'],
            'hashed_email' => $this->hashingService->hashValue($data['email']),
            'email_verified_at' => Carbon::now()
        ]);

        $user->assignRole($data['role']);

        return $user;
    }

    public function update(array $data, int $id)
    {
        $user = $this->model->findOrFail($id);

        $user->update([
            'name' => $data['name'],
            'hashed_name' => $this->hashingService->hashValue($data['name']),
            'email' => $data['email'],
            'hashed_email' => $this->hashingService->hashValue($data['email']),
            'email_verified_at' => Carbon::now()
        ]);

    
        $user->syncRoles([$data['role']]);

        return $user;
    }
}

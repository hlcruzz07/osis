<?php

namespace App\Repositories;

use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;
class RoleRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected Role $model, protected Permission $permission)
    {
        //
    }

    public function paginate(array $filters)
    {

        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
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

        return $query->with('permissions')->paginate($show);
    }

    public function create(array $data){
        $role = $this->model->create([
            'name' => Str::slug($data['name'], '_'),
        ]);

        $role->givePermissionTo($data['permissions']);

        return $role;

    }

     public function update(array $data, int $id){
        $role = $this->model->findOrFail($id);

        $role->update([
           'name' => Str::slug($data['name'], '_'),
        ]);

        $role->syncPermissions($data['permissions']);

        return $role;

    }
}

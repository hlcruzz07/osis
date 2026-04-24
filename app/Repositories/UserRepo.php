<?php

namespace App\Repositories;

use App\Models\User;

class UserRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected User $model)
    {
        //
    }
    public function paginate(array $filters)
    {

        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
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

        return $query->with('roles')->paginate($show);
    }



}

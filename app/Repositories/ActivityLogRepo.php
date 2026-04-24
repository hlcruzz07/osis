<?php

namespace App\Repositories;

use App\Models\ActivityLog;
use App\Services\HashingService;
use Illuminate\Support\Facades\DB;

class ActivityLogRepo
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected ActivityLog $model)
    {
        //
    }

    public function paginate(array $filters)
    {

        $query = $this->model->query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%")
                    ->orWhere('browser', 'like', "%{$search}%");
            });

        }

        if (!empty($filters['action'])) {
            $query->where('action', $filters['action']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['created_at_from']) && !empty($filters['created_at_to'])) {
            if ($filters['created_at_from'] === $filters['created_at_to']) {
                $query->whereDate('created_at', $filters['created_at_from']);
            } else {
                $query->whereDate('created_at', '>=', $filters['created_at_from'])
                    ->whereDate('created_at', '<=', $filters['created_at_to']);
            }
        }

        $sort = $filters['sort'] ?? 'id';
        $order = $filters['order'] ?? 'desc';

        $query->orderBy($sort, $order);

        $show = $filters['show'] ?? 10;

        return $query->paginate($show);
    }
    public function getActivityActionsCount()
    {
        $actions = ['create', 'update', 'login', 'export'];

        $counts = $this->model->query()
            ->select('action', DB::raw('COUNT(*) as count'))
            ->whereIn('action', $actions)
            ->groupBy('action')
            ->pluck('count', 'action')
            ->toArray();
        return array_merge(
            array_fill_keys($actions, 0),
            $counts
        );
    }
}

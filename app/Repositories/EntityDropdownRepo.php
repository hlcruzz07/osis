<?php

namespace App\Repositories;

use App\Models\EntityDropdown;

class EntityDropdownRepo
{
    protected EntityDropdown $model;

    /**
     * Get dropdown array by title
     *
     * @param string $title
     * @return array
     */

    public function all()
    {
        return EntityDropdown::all()->toArray();
    }
    public function getDropdownsByTitle(string $title)
    {
        $entityDropdowns = EntityDropdown::all()->toArray();

        return array_values(array_filter($entityDropdowns, function ($item) use ($title) {
            return $item['title'] === $title;
        }))[0]['dropdowns'] ?? [];
    }
}
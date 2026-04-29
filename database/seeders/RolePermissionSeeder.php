<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // roles
        $admin = Role::create(['name' => 'admin']);
        $superAdmin = Role::create(['name' => 'super_admin']);

        // permissions
        $permissions = [

            // students
            'view_students',
            'update_students',
            'export_students',

            // logs
            'view_activity_logs',
            'export_activity_logs',

            'update_academic_year_and_semester',

            // Accounts
            'view_accounts',
            'update_accounts',
            'delete_accounts',
            'create_accounts',

            // Roles & Permisions
            'view_roles',
            'update_roles',
            'create_roles',
            'delete_roles',

            'view_permissions',
            'update_permissions',
            'create_permissions',
            'delete_permissions'
        ];

        $permissions = [
           
        ];

        foreach ($permissions as $perm) {
            Permission::create(['name' => $perm]);
        }

        // give all permissions to super admin
        $superAdmin->givePermissionTo(Permission::all());

        // admin gets limited permissions
        $admin->givePermissionTo([
            'view_students',
            'export_students',
            'view_activity_logs',
            'update_academic_year_and_semester'
        ]);
    }
}

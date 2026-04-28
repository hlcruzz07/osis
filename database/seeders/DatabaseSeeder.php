<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        // $user = User::factory()->updateOrCreate([
        //     'email' => 'haroldlyndon.cruz@chmsu.edu.ph',
        // ], [
        //     'avatar' => 'https://lh3.googleusercontent.com/a/ACg8ocKsTaVp-MSh80eJ6uyRnH2w2bbrc7p1N7D9HMpL1LZv1GzO0A=s96-c',
        //     'name' => 'Harold Cruz',
        //     'email_verified_at' => Carbon::now(),
        // ]);

        // $user->assignRole('super_admin');

        // // Seed questions with sub-questions
        // $this->call(QuestionSeeder::class);
        // $this->call(EntityDropdownSeeder::class);
        // $this->call(RolePermissionSeeder::class);
        $this->call(UserSeeder::class);
    }
}

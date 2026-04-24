<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'email' => 'harold.cruz0407@gmail.com',
            'avatar' => null,
            'name' => 'Don Cruz',
            'email_verified_at' => Carbon::now(),
        ]);

        $user->assignRole('admin');
    }
}

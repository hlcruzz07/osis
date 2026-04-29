<?php

namespace Database\Seeders;

use App\Models\User;
use App\Services\HashingService;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function __construct(protected HashingService $hashingService)
    {

    }
    public function run(): void
    {
        $user = User::create([
            'email' => 'harold.cruz0407@gmail.com',
            'hashed_email' => $this->hashingService->hashValue('harold.cruz0407@gmail.com'),
            'avatar' => null,
            'name' => 'Don Cruz',
            'hashed_name' => $this->hashingService->hashValue('Don Cruz'),
            'email_verified_at' => Carbon::now(),
        ]);

        $user->assignRole('admin');

        $user2 = User::create([
            'email' => 'haroldlyndon.cruz@chmsu.edu.ph',
            'hashed_email' => $this->hashingService->hashValue('haroldlyndon.cruz@chmsu.edu.ph'),
            'avatar' => null,
            'name' => 'Harold Lyndon Cruz',
            'hashed_name' => $this->hashingService->hashValue('Harold Lyndon Cruz'),
            'email_verified_at' => Carbon::now(),
        ]);

        $user2->assignRole('super_admin');

    }
}

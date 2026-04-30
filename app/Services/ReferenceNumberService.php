<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Str;

class ReferenceNumberService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected HashingService $hashingService)
    {
        //
    }

    public function generate()
    {
        do {
            $refNumber = strtoupper(Str::random(10));

            $exists = Student::where('ref_number_hash', $this->hashingService->hashValue($refNumber))->exists();

        } while ($exists);

        return $refNumber;
    }
}

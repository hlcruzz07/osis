<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyInfo extends Model
{
    protected $fillable = [
        'student_id',
        'family_size',
        'parent_martial_status',
        'nature_residence',
        'house_monthly_income',
        'ordinal_position',

        'family_size_hash',
        'parent_martial_status_hash',
        'nature_residence_hash',
        'house_monthly_income_hash',
        'ordinal_position_hash',
    ];

    protected $casts = [
        'family_size' => 'encrypted',
        'parent_martial_status' => 'encrypted',
        'nature_residence' => 'encrypted',
        'house_monthly_income' => 'encrypted',
        'ordinal_position' => 'encrypted',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}

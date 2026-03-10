<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('lrn')->nullable()->unique();
            $table->string('year_level');
            $table->string('campus');
            $table->string('course');
            $table->string('date_admitted');
            $table->string('student_type');
            $table->string('equity_indicator');

            $table->string('fname');
            $table->string('mname')->nullable();
            $table->string('lname');
            $table->string('suffix')->nullable();
            $table->string('birthdate');
            $table->string('birthplace');
            $table->string('weekly_allowance');
            $table->string('financer');
            $table->string('last_attended_school');
            $table->string('email')->nullable();
            $table->string('mobile_num')->nullable();
            $table->string('religion');
            $table->string('citizenship');
            $table->string('civil_status');
            $table->string('sexual_orient');
            $table->string('height');
            $table->string('weight');

            $table->string('family_size');
            $table->string('nature_residence');
            $table->string('house_monthly_income');
            $table->string('ordinal_position');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};

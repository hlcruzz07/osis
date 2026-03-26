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
            $table->text('academic_year');
            $table->text('semester');
            $table->text('lrn')->nullable()->unique();
            $table->text('year_level');
            $table->text('campus');
            $table->text('course');
            $table->text('date_admitted');
            $table->text('student_type');
            $table->text('equity_indicator');

            $table->text('fname');
            $table->text('mname')->nullable();
            $table->text('lname');
            $table->text('suffix')->nullable();
            $table->text('birthdate');
            $table->text('birthplace');
            $table->text('weekly_allowance');
            $table->text('financer');
            $table->text('last_attended_school');
            $table->text('email')->nullable();
            $table->text('mobile_num')->nullable();
            $table->text('religion');
            $table->text('citizenship');
            $table->text('civil_status');
            $table->text('sexual_orient');
            $table->text('height');
            $table->text('weight');

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

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
        Schema::create('guardians', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->string('fname');
            $table->string('mname')->nullable();
            $table->string('lname');
            $table->string('suffix')->nullable();
            $table->string('role');
            $table->string('birthdate')->nullable();
            $table->string('birthplace')->nullable();
            $table->string('mobile_num')->nullable();
            $table->string('religion');
            $table->string('citizenship');
            $table->string('highest_educ_attainment');
            $table->string('life_status');
            $table->string('cause_of_death')->nullable();
            $table->string('year_of_death')->nullable();
            $table->string('occupation')->nullable();
            $table->boolean('is_contact_person')->default(false);

            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guardians');
    }
};

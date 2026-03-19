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
            $table->text('fname');
            $table->text('mname')->nullable();
            $table->text('lname');
            $table->text('suffix')->nullable();
            $table->text('role');
            $table->text('birthdate')->nullable();
            $table->text('birthplace')->nullable();
            $table->text('mobile_num')->nullable();
            $table->text('religion');
            $table->text('citizenship');
            $table->text('highest_educ_attainment');
            $table->text('life_status');
            $table->text('cause_of_death')->nullable();
            $table->text('year_of_death')->nullable();
            $table->text('occupation')->nullable();
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

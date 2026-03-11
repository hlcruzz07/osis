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
        Schema::create('education', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->string('education_level');

            $table->string('school_name');
            $table->string('school_address');
            $table->string('school_type');
            $table->string('year_graduated');
            $table->string('general_average', 5, 2);
            $table->string('course')->nullable()->default(null);
            $table->string('academic_year')->nullable()->default(null);
            $table->string('scholarship_program')->nullable()->default(null);
            $table->string('scholarship_address')->nullable()->default(null);
            $table->string('scholarship_mobile_num')->nullable()->default(null);

            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('education');
    }
};

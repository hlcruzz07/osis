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
            $table->text('education_level');

            $table->text('school_name');
            $table->text('school_address');
            $table->text('school_type');
            $table->text('year_graduated');
            $table->text('general_average', 5, 2);
            $table->text('strand')->nullable();
            $table->text('course')->nullable()->default(null);
            $table->text('academic_year')->nullable()->default(null);
            $table->text('scholarship_program')->nullable()->default(null);
            $table->text('scholarship_address')->nullable()->default(null);
            $table->text('scholarship_mobile_num')->nullable()->default(null);

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

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
        Schema::table('education', function (Blueprint $table) {
            $table->text('education_level_hash')->nullable();
            $table->text('school_name_hash')->nullable();
            $table->text('school_address_hash')->nullable();
            $table->text('school_type_hash')->nullable();
            $table->text('year_graduated_hash')->nullable();
            $table->text('general_average_hash')->nullable();
            $table->text('strand_hash')->nullable();
            $table->text('course_hash')->nullable();
            $table->text('academic_year_hash')->nullable();
            $table->text('scholarship_program_hash')->nullable();
            $table->text('scholarship_address_hash')->nullable();
            $table->text('scholarship_mobile_num_hash')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('education', function (Blueprint $table) {
            $table->dropColumn([
                'education_level_hash',
                'school_name_hash',
                'school_address_hash',
                'school_type_hash',
                'year_graduated_hash',
                'general_average_hash',
                'strand_hash',
                'course_hash',
                'academic_year_hash',
                'scholarship_program_hash',
                'scholarship_address_hash',
                'scholarship_mobile_num_hash',
            ]);
        });
    }
};

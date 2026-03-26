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
        Schema::table('students', function (Blueprint $table) {
            $table->text('academic_year_hash')->nullable();
            $table->text('semester_hash')->nullable();
            $table->text('lrn_hash')->nullable();
            $table->text('year_level_hash')->nullable();
            $table->text('campus_hash')->nullable();
            $table->text('course_hash')->nullable();
            $table->text('date_admitted_hash')->nullable();
            $table->text('student_type_hash')->nullable();
            $table->text('equity_indicator_hash')->nullable();
            $table->text('fname_hash')->nullable();
            $table->text('mname_hash')->nullable();
            $table->text('lname_hash')->nullable();
            $table->text('suffix_hash')->nullable();
            $table->text('birthdate_hash')->nullable();
            $table->text('birthplace_hash')->nullable();
            $table->text('weekly_allowance_hash')->nullable();
            $table->text('financer_hash')->nullable();
            $table->text('last_attended_school_hash')->nullable();
            $table->text('email_hash')->nullable();
            $table->text('mobile_num_hash')->nullable();
            $table->text('religion_hash')->nullable();
            $table->text('citizenship_hash')->nullable();
            $table->text('civil_status_hash')->nullable();
            $table->text('sexual_orient_hash')->nullable();
            $table->text('height_hash')->nullable();
            $table->text('weight_hash')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'academic_year_hash',
                'semester_hash',
                'lrn_hash',
                'year_level_hash',
                'campus_hash',
                'course_hash',
                'date_admitted_hash',
                'student_type_hash',
                'equity_indicator_hash',
                'fname_hash',
                'mname_hash',
                'lname_hash',
                'suffix_hash',
                'birthdate_hash',
                'birthplace_hash',
                'weekly_allowance_hash',
                'financer_hash',
                'last_attended_school_hash',
                'email_hash',
                'mobile_num_hash',
                'religion_hash',
                'citizenship_hash',
                'civil_status_hash',
                'sexual_orient_hash',
                'height_hash',
                'weight_hash',
                'family_size_hash',
                'nature_residence_hash',
                'house_monthly_income_hash',
                'ordinal_position_hash',
            ]);
        });
    }
};

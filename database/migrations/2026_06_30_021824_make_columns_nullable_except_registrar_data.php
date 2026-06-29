<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Make columns nullable ONLY for fields NOT submitted by the registrar form.
     */
    public function up(): void
    {
        // Students — columns NOT in registrar form that were originally NOT NULL
        // Registrar submits: fname, lname, birthdate, birthplace, sexual_orient, civil_status,
        //   email, date_admitted, campus, year_level, course, student_type,
        //   is_first_generation_student, is_indigenous_people  → those stay NOT NULL
        Schema::table('students', function (Blueprint $table) {
            $table->text('equity_indicator')->nullable()->change();
            $table->text('weekly_allowance')->nullable()->change();
            $table->text('financer')->nullable()->change();
            $table->text('last_attended_school')->nullable()->change();
            $table->text('religion')->nullable()->change();
            $table->text('citizenship')->nullable()->change();
            $table->text('height')->nullable()->change();
            $table->text('weight')->nullable()->change();
        });

        // Addresses — zip_code is optional (null) in the registrar form
        Schema::table('addresses', function (Blueprint $table) {
            $table->text('zip_code')->nullable()->change();
        });

        // Guardians — all registrar-required fields (role, fname, lname, religion,
        //   citizenship, highest_educ_attainment, life_status) are already NOT NULL.
        //   Optional fields (mname, suffix, birthdate, birthplace, mobile_num, occupation,
        //   cause_of_death, year_of_death) are already nullable — nothing to change.

        // Education — optional fields (strand, course, academic_year, scholarship_*)
        //   are already nullable in the original migration — nothing to change.
        //   Required fields (education_level, school_name, school_address, school_type,
        //   year_graduated, general_average) stay NOT NULL.

        // Family Info — entire table is outside the registrar form
        Schema::table('family_infos', function (Blueprint $table) {
            $table->text('family_size')->nullable()->change();
            $table->text('parent_martial_status')->nullable()->change();
            $table->text('nature_residence')->nullable()->change();
            $table->text('house_monthly_income')->nullable()->change();
            $table->text('ordinal_position')->nullable()->change();
            $table->text('family_size_hash')->nullable()->change();
            $table->text('parent_martial_status_hash')->nullable()->change();
            $table->text('nature_residence_hash')->nullable()->change();
            $table->text('house_monthly_income_hash')->nullable()->change();
            $table->text('ordinal_position_hash')->nullable()->change();
        });

        // Siblings — entire table is outside the registrar form
        Schema::table('siblings', function (Blueprint $table) {
            $table->text('fname')->nullable()->change();
            $table->text('lname')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->text('equity_indicator')->nullable(false)->change();
            $table->text('weekly_allowance')->nullable(false)->change();
            $table->text('financer')->nullable(false)->change();
            $table->text('last_attended_school')->nullable(false)->change();
            $table->text('religion')->nullable(false)->change();
            $table->text('citizenship')->nullable(false)->change();
            $table->text('height')->nullable(false)->change();
            $table->text('weight')->nullable(false)->change();
        });

        Schema::table('addresses', function (Blueprint $table) {
            $table->text('zip_code')->nullable(false)->change();
        });

        Schema::table('family_infos', function (Blueprint $table) {
            $table->text('family_size')->nullable(false)->change();
            $table->text('parent_martial_status')->nullable(false)->change();
            $table->text('nature_residence')->nullable(false)->change();
            $table->text('house_monthly_income')->nullable(false)->change();
            $table->text('ordinal_position')->nullable(false)->change();
            $table->text('family_size_hash')->nullable(false)->change();
            $table->text('parent_martial_status_hash')->nullable(false)->change();
            $table->text('nature_residence_hash')->nullable(false)->change();
            $table->text('house_monthly_income_hash')->nullable(false)->change();
            $table->text('ordinal_position_hash')->nullable(false)->change();
        });

        Schema::table('siblings', function (Blueprint $table) {
            $table->text('fname')->nullable(false)->change();
            $table->text('lname')->nullable(false)->change();
        });
    }
};

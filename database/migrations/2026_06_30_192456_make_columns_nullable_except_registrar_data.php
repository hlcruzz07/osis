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

        Schema::table('students', function (Blueprint $table) {
            $table->text('equity_indicator')->nullable()->change();
            $table->text('weekly_allowance')->nullable()->change();
            $table->text('financer')->nullable()->change();
            $table->text('last_attended_school')->nullable()->change();
            $table->text('religion')->nullable()->change();
            $table->text('citizenship')->nullable()->change();
            $table->text('height')->nullable()->change();
            $table->text('weight')->nullable()->change();
            $table->text('student_type')->nullable()->change();
            $table->text('student_type_hash')->nullable()->change();
            $table->text('year_level')->nullable()->change();
            $table->text('year_level_hash')->nullable()->change();
            $table->text('sexual_orient')->nullable()->change();
            $table->text('sexual_orient_hash')->nullable()->change();
        });


        Schema::table('addresses', function (Blueprint $table) {
            $table->text('zip_code')->nullable()->change();
        });

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
        Schema::table('guardians', function (Blueprint $table) {
            $table->text('birthdate')->nullable()->change();
            $table->text('birthdate_hash')->nullable()->change();
            $table->text('birthplace')->nullable()->change();
            $table->text('birthplace_hash')->nullable()->change();
            $table->text('religion')->nullable()->change();
            $table->text('religion_hash')->nullable()->change();
            $table->text('citizenship')->nullable()->change();
            $table->text('citizenship_hash')->nullable()->change();
            $table->text('life_status')->nullable()->change();
            $table->text('life_status_hash')->nullable()->change();
            $table->text('occupation')->nullable()->change();
            $table->text('occupation_hash')->nullable()->change();
        });

        Schema::table('education', function (Blueprint $table) {
            $table->text('general_average')->nullable()->change();
            $table->text('general_average_hash')->nullable()->change();
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
            $table->text('student_type')->nullable(false)->change();
            $table->text('student_type_hash')->nullable(false)->change();
            $table->text('year_level')->nullable(false)->change();
            $table->text('year_level_hash')->nullable(false)->change();
            $table->text('sexual_orient')->nullable(false)->change();
            $table->text('sexual_orient_hash')->nullable(false)->change();
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

        Schema::table('guardians', function (Blueprint $table) {
            $table->text('birthdate')->nullable(false)->change();
            $table->text('birthdate_hash')->nullable(false)->change();
            $table->text('birthplace')->nullable(false)->change();
            $table->text('birthplace_hash')->nullable(false)->change();
            $table->text('religion')->nullable(false)->change();
            $table->text('religion_hash')->nullable(false)->change();
            $table->text('citizenship')->nullable(false)->change();
            $table->text('citizenship_hash')->nullable(false)->change();
            $table->text('life_status')->nullable(false)->change();
            $table->text('life_status_hash')->nullable(false)->change();
            $table->text('occupation')->nullable(false)->change();
            $table->text('occupation_hash')->nullable(false)->change();
        });

        Schema::table('education', function (Blueprint $table) {
            $table->text('general_average')->nullable(false)->change();
            $table->text('general_average_hash')->nullable(false)->change();
        });
    }
};

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
        Schema::table('guardians', function (Blueprint $table) {
            $table->text('fname_hash')->nullable();
            $table->text('mname_hash')->nullable();
            $table->text('lname_hash')->nullable();
            $table->text('suffix_hash')->nullable();
            $table->text('role_hash')->nullable();
            $table->text('birthdate_hash')->nullable();
            $table->text('birthplace_hash')->nullable();
            $table->text('mobile_num_hash')->nullable();
            $table->text('religion_hash')->nullable();
            $table->text('citizenship_hash')->nullable();
            $table->text('highest_educ_attainment_hash')->nullable();
            $table->text('life_status_hash')->nullable();
            $table->text('cause_of_death_hash')->nullable();
            $table->text('year_of_death_hash')->nullable();
            $table->text('occupation_hash')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guardians', function (Blueprint $table) {
            $table->dropColumn([
                'fname_hash',
                'mname_hash',
                'lname_hash',
                'suffix_hash',
                'role_hash',
                'birthdate_hash',
                'birthplace_hash',
                'mobile_num_hash',
                'religion_hash',
                'citizenship_hash',
                'highest_educ_attainment_hash',
                'life_status_hash',
                'cause_of_death_hash',
                'year_of_death_hash',
                'occupation_hash',
            ]);
        });
    }
};

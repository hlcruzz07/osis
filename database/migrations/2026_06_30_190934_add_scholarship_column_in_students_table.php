<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->text('scholarship_program')->nullable();
            $table->text('scholarship_program_hash')->nullable();

            $table->text('scholarship_address')->nullable();
            $table->text('scholarship_address_hash')->nullable();

            $table->text('scholarship_contact')->nullable();
            $table->text('scholarship_contact_hash')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'scholarship_program',
                'scholarship_program_hash',
                'scholarship_address',
                'scholarship_address_hash',
                'scholarship_contact',
                'scholarship_contact_hash'
            ]);
        });
    }
};

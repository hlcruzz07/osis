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
            $table->text('section')->nullable();
            $table->text('section_hash')->nullable();
            $table->text('street')->nullable();
            $table->text('street_hash')->nullable();
            $table->text('social_media_account')->nullable();
            $table->text('social_media_account_hash')->nullable();
        });

        Schema::table('addresses', function (Blueprint $table) {

            $table->text('street')->nullable();
            $table->text('street_hash')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'section',
                'section_hash',
                'street',
                'street_hash',
                'social_media_account',
                'social_media_account_hash',
            ]);
        });

        Schema::table('addresses', function (Blueprint $table) {

            $table->text('street')->nullable();
            $table->text('street_hash')->nullable();

        });
    }
};

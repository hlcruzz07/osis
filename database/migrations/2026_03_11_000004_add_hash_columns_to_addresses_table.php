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
        Schema::table('addresses', function (Blueprint $table) {
            $table->text('island_hash')->nullable();
            $table->text('region_hash')->nullable();
            $table->text('province_hash')->nullable();
            $table->text('city_hash')->nullable();
            $table->text('brgy_hash')->nullable();
            $table->text('zip_code_hash')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn([
                'island_hash',
                'region_hash',
                'province_hash',
                'city_hash',
                'brgy_hash',
                'zip_code_hash',
            ]);
        });
    }
};

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
        Schema::table('siblings', function (Blueprint $table) {
            $table->text('fname_hash')->nullable();
            $table->text('mname_hash')->nullable();
            $table->text('lname_hash')->nullable();
            $table->text('suffix_hash')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siblings', function (Blueprint $table) {
            $table->dropColumn([
                'fname_hash',
                'mname_hash',
                'lname_hash',
                'suffix_hash',
            ]);
        });
    }
};

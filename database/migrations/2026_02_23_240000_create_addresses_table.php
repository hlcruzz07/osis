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
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('guardian_id')->nullable();

            $table->text('island');
            $table->text('region');
            $table->text('province');
            $table->text('city');
            $table->text('brgy');
            $table->text('zip_code');

            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');

            $table->foreign('guardian_id')
                ->references('id')
                ->on('guardians')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};

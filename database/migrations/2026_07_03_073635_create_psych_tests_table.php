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
        Schema::create('psych_tests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->text('date_taken')->nullable();
            $table->text('date_taken_hash')->nullable();
            $table->text('name')->nullable();
            $table->text('name_hash')->nullable();
            $table->text('result')->nullable();
            $table->text('result_hash')->nullable();
            $table->text('interpretation')->nullable();
            $table->text('interpretation_hash')->nullable();
            $table->foreign('student_id')
                ->references('id')
                ->on('students')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psych_tests');
    }
};

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
        Schema::create('siblings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->text('fname');
            $table->text('mname')->nullable();
            $table->text('lname');
            $table->text('suffix')->nullable();
            $table->boolean('is_attending_college')->default(false);
            $table->boolean('is_employed')->default(false);

            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siblings');
    }
};

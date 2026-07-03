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
        Schema::create('answer_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_answer_id');
            $table->text('img');
            $table->foreign('student_answer_id')
                ->references('id')
                ->on('student_answers')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answer_attachments');
    }
};

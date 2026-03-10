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
        Schema::create('student_sub_answers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sub_question_id');
            $table->unsignedBigInteger('student_id');

            $table->text('answer_text')->nullable();
            $table->integer('answer_number')->nullable();
            $table->date('answer_date')->nullable();
            $table->boolean('answer_boolean')->nullable();

            $table->foreign('sub_question_id')->references('id')->on('sub_questions')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_sub_answers');
    }
};

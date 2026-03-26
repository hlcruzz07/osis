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
        Schema::create('family_infos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->text('family_size');
            $table->text('parent_martial_status');
            $table->text('nature_residence');
            $table->text('house_monthly_income');
            $table->text('ordinal_position');

            $table->text('family_size_hash');
            $table->text('parent_martial_status_hash');
            $table->text('nature_residence_hash');
            $table->text('house_monthly_income_hash');
            $table->text('ordinal_position_hash');


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
        Schema::dropIfExists('family_infos');
    }
};

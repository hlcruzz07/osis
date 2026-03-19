<?php

namespace App\Http\Controllers;

use App\Models\EntityDropdown;
use App\Repositories\StudentRepo;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminStudentsController extends Controller
{
    public function __construct(protected StudentRepo $studentRepo)
    {
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Students/Index');
    }

    public function view(int $id)
    {

        $student = $this->studentRepo->getStudentById($id);

        return Inertia::render('Admin/Students/View/Index', [
            'student' => $student,
            'dropdowns' => EntityDropdown::all()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateStudentInfo(Request $request, int $id)
    {
        try {
            $this->studentRepo->updateStudentInfoById($id, $request->all());

            return back()->with('success', 'Student Information updated!');
        } catch (Exception $e) {
            return back()->with('error', 'Something went wrong, please try again.' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

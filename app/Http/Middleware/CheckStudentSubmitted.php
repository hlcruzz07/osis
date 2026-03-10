<?php

namespace App\Http\Middleware;

use App\Http\Requests\StudentInfoRequest;
use App\Models\Student;
use App\Repositories\StudentRepo;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStudentSubmitted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function __construct(protected StudentRepo $studentRepo)
    {
    }
    public function handle(Request $request, Closure $next): Response
    {



        return $next($request);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    public function index(){
        return Course::all();
    }

    public function show(Course $course) {
        return view('courses.show', compact('course'));
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'instructor' => 'required|string|max:255',
        'price' => 'required|numeric',
        'video' => 'nullable|file|mimes:mp4,mov,avi|max:204800'
    ]);

    if ($request->hasFile('video')) {
        $validated['video_path'] = $request->file('video')->store('videos', 'public');
    }

    Course::create($validated);

    return redirect()->route('courses.create')->with('success', 'Course created successfully!');
}

}


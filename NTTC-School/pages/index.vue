<template>
    <div class="p-6 space-y-6">
      <h1 class="text-3xl font-bold">Available Courses</h1>
      <div v-for="course in courses" :key="course.id" class="bg-white shadow p-4 rounded">
        <h2 class="text-xl font-semibold">{{ course.title }}</h2>
        <p class="text-gray-600">{{ course.description }}</p>
        <div class="mt-4">
          <img v-if="course.image" :src="course.image" class="w-full max-w-sm mb-2 rounded">
          <video v-if="course.video" controls class="w-full max-w-md mb-2">
            <source :src="course.video" type="video/mp4" />
          </video>
          <a v-if="course.pdf" :href="course.pdf" target="_blank" class="text-blue-500 underline">Download PDF</a>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // Removed duplicate declaration of courses

  const courses = ref([]);

  onMounted(async () => {
    const res = await fetch('http://localhost:5000/api/courses');
    courses.value = await res.json();
  });
  </script>
  
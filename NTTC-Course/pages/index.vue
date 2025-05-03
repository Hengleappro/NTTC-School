<template>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-4">Available Courses</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NuxtLink
          v-for="course in courses"
          :key="course.id"
          :to="`/course/${course.id}`"
          class="border rounded-xl p-4 hover:shadow-lg transition"
        >
          <h2 class="text-xl font-semibold">{{ course.title }}</h2>
          <p class="text-gray-600 mt-2">{{ course.description }}</p>
        </NuxtLink>
      </div>
    </div>
  </template>
  
  <script setup>
    const { data: courses } = await useFetch('http://localhost:3001/api/courses');
  </script>

<template>
    <div class="p-6">
      <NuxtLink to="/" class="text-blue-500 mb-4 inline-block">← Back to Courses</NuxtLink>
      <h1 class="text-3xl font-bold">{{ course.title }}</h1>
      <p class="text-gray-600 mt-4">{{ course.description }}</p>
      <div class="mt-6">
        <h2 class="text-xl font-semibold">Lessons</h2>
        <ul class="list-disc ml-6 mt-2">
          <li v-for="(lesson, i) in course.lessons" :key="i">{{ lesson }}</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
    const route = useRoute();
    const { data: course } = await useFetch(`http://localhost:3001/api/courses/${route.params.id}`);
  </script>
  
<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Available Courses</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="course in courses" :key="course.id" class="bg-white rounded shadow p-4">
        <h2 class="text-xl font-semibold">{{ course.title }}</h2>
        <p class="text-sm text-gray-600">{{ course.description }}</p>
        <p class="mt-2 text-blue-600 font-bold">${{ course.price }}</p>
        <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Enroll</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = ref([])

onMounted(async () => {
  const response = await axios.get('/api/courses')
  courses.value = response.data
})
</script>

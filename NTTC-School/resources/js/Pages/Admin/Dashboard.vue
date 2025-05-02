<template>
    <div class="p-8 max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Create a New Course</h1>
      <form @submit.prevent="submit" class="bg-white p-6 rounded shadow space-y-4">
        <input v-model="form.title" placeholder="Course Title" class="w-full border rounded p-2" />
        <textarea v-model="form.description" placeholder="Description" class="w-full border rounded p-2"></textarea>
        <input v-model="form.instructor" placeholder="Instructor" class="w-full border rounded p-2" />
        <input v-model.number="form.price" placeholder="Price" type="number" class="w-full border rounded p-2" />
        <input type="file" @change="handleVideo" class="w-full border p-2" />
        <button class="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { router } from '@inertiajs/vue3'
  
  const form = ref({
    title: '',
    description: '',
    instructor: '',
    price: '',
    video: null
  })
  
  const handleVideo = (e) => {
    form.value.video = e.target.files[0]
  }
  
  const submit = () => {
    const data = new FormData()
    for (const key in form.value) {
      data.append(key, form.value[key])
    }
  
    router.post('/api/courses', data)
  }
  </script>
  
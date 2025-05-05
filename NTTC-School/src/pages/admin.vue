<template>
    <div class="p-6 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Upload New Course</h1>
      <form @submit.prevent="handleUpload" class="space-y-4">
        <input v-model="form.title" type="text" placeholder="Course Title" class="w-full p-2 border rounded" />
        <textarea v-model="form.description" placeholder="Course Description" class="w-full p-2 border rounded"></textarea>
        <input type="file" @change="handleFile('image', $event)" accept="image/*" class="w-full p-2 border rounded" />
        <input type="file" @change="handleFile('video', $event)" accept="video/*" class="w-full p-2 border rounded" />
        <input type="file" @change="handleFile('pdf', $event)" accept="application/pdf" class="w-full p-2 border rounded" />
        <button type="submit" class="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700 transition">Upload</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const form = ref({
    title: '',
    description: '',
    image: null,
    video: null,
    pdf: null
  })
  
  function handleFile(type, event) {
    form.value[type] = event.target.files[0]
  }
  
  function handleUpload() {
    // Implement upload logic here (e.g., send to backend or cloud storage)
    console.log("Uploading course:", form.value)
  }

  async function handleUpload() {
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('description', form.value.description)
  formData.append('image', form.value.image)
  formData.append('video', form.value.video)
  formData.append('pdf', form.value.pdf)

  await fetch('http://localhost:5000/api/courses', {
    method: 'POST',
    body: formData
  }).then(res => res.json())
    .then(data => {
      alert("Uploaded!")
      console.log(data)
    })
}
  </script>
  
<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md transition-transform duration-500" :class="{ 'scale-110': animating }">
        <h2 class="text-2xl font-bold text-center">{{ isLogin ? 'Login' : 'Register' }}</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input type="email" placeholder="Email" v-model="form.email" class="w-full p-2 border rounded" />
          <input type="password" placeholder="Password" v-model="form.password" class="w-full p-2 border rounded" />
          <input v-if="!isLogin" type="text" placeholder="Username" v-model="form.username" class="w-full p-2 border rounded" />
          <button type="submit" class="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition">Submit</button>
        </form>
        <p class="text-center text-sm">
          <button class="text-blue-500 underline" @click="toggleForm">
            {{ isLogin ? "Don't have an account? Register" : "Already have an account? Login" }}
          </button>
        </p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const isLogin = ref(true)
  const animating = ref(false)
  const form = ref({ email: '', password: '', username: '' })
  
  function toggleForm() {
    animating.value = true
    setTimeout(() => {
      isLogin.value = !isLogin.value
      animating.value = false
    }, 300)
  }
  
  function handleSubmit() {
    // Here you would send form data to your backend
    console.log("Form submitted:", form.value)
  }

  async function handleSubmit() {
  const endpoint = isLogin.value ? 'login' : 'register'
  const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  });

  const data = await response.json()
  console.log(data)

  if (data.token) {
    localStorage.setItem('token', data.token)
    alert("Login successful!")
  } else if (data.message) {
    alert(data.message)
  }
}

  </script>
  
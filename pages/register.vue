<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    :style="{ backgroundImage: 'url(/background.jpg)' }"
  >
    <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
    
    <div class="relative w-full max-w-md px-4">
      <div class="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl overflow-hidden">
        <div class="p-8">
          <h1 class="text-3xl font-bold text-center text-white mb-8">Create Account</h1>
          
          <form class="space-y-4" @submit.prevent="submitForm">
            <div v-if="errors.length" class="p-3 bg-red-500/20 rounded-lg">
              <ul class="text-sm text-red-200">
                <li v-for="(error, index) in errors" :key="index" class="list-disc list-inside">
                  {{ error }}
                </li>
              </ul>
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                autocomplete="name"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="John Doe"
              >
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="email@example.com"
              >
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="••••••••"
              >
            </div>

            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-white mb-2">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="••••••••"
              >
            </div>

            <div>
              <label for="avatar" class="block text-sm font-medium text-white mb-2">
                Avatar URL (Optional)
              </label>
              <input
                id="avatar"
                v-model="form.avatar"
                type="url"
                placeholder="https://example.com/your-avatar.jpg"
                class="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              >
              <p class="mt-1 text-xs text-gray-300">Paste a direct link to your profile picture.</p>
            </div>
            <div class="pt-2">
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Create Account</span>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-white">
              Already have an account?
              <NuxtLink to="/login" class="font-medium text-blue-300 hover:text-blue-200"> Sign in
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

useHead({
  title: 'Create Account - NTTC School', // Changed title for consistency
});

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  avatar: '', // NEW: Add avatar field to form
});

const errors = ref([]);
const loading = ref(false);

const submitForm = async () => {
  errors.value = [];
  loading.value = true;

  // Client-side validation
  if (form.password !== form.password_confirmation) {
    errors.value.push('Passwords do not match.');
    loading.value = false;
    return;
  }
  if (form.password.length < 6) { 
    errors.value.push('Password must be at least 6 characters.');
    loading.value = false;
    return;
  }
  if (!form.name.trim()) {
    errors.value.push('Full Name is required.');
    loading.value = false;
    return;
  }
  if (!form.email.includes('@')) {
    errors.value.push('Please enter a valid email address.');
    loading.value = false;
    return;
  }
  // Optional: Basic avatar URL validation
  if (form.avatar && !/^https?:\/\/.+/.test(form.avatar)) { // Very basic check for http/https
    errors.value.push('Please enter a valid URL for your avatar.');
    loading.value = false;
    return;
  }


  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        password: form.password,
        avatar: form.avatar, // NEW: Include avatar in the payload
      },
    });

    console.log('Registration successful:', response.message, response.user);

    await navigateTo('/login?registered=true');

  } catch (error) {
    console.error('Registration error object:', error);
    loading.value = false;

    if (error.response && error.response._data && error.response._data.statusMessage) {
      errors.value.push(error.response._data.statusMessage);
    } else if (error.data && error.data.statusMessage) {
      errors.value.push(error.data.statusMessage);
    }
    else {
      errors.value.push('An unexpected error occurred. Please try again.');
    }
  } finally {
    if (errors.value.length > 0) {
        loading.value = false;
    }
  }
};
</script>

<style scoped>
/* Your component-specific styles can go here if needed */
</style>
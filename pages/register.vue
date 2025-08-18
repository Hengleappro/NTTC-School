<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    :style="{ backgroundImage: 'url(https://res.cloudinary.com/dfgegfg9c/image/upload/v1747697656/stxkgrtvsxd2iyh2cxw9.jpg)' }"
  >
    <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-md"></div>
    
    <div class="relative w-full max-w-md px-4 mt-24">
      <div class="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
        <div class="p-8">
          <h1 class="text-3xl font-extrabold text-center text-white mb-3 drop-shadow-lg tracking-wider">Create Account</h1>
          
          <form class="" @submit.prevent="submitForm">
            <div v-if="errors.length" class="p-4 bg-red-800/40 rounded-xl">
              <ul class="text-sm text-red-300">
                <li v-for="(error, index) in errors" :key="index" class="list-disc list-inside">
                  {{ error }}
                </li>
              </ul>
            </div>

            <div class="relative">
              <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                autocomplete="name"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-700/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 border border-transparent focus:border-purple-500"
                placeholder="John Doe"
              >
            </div>

            <div class="relative">
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-700/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 border border-transparent focus:border-purple-500"
                placeholder="email@example.com"
              >
            </div>

            <div class="relative">
              <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-700/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 border border-transparent focus:border-purple-500"
                placeholder="••••••••"
              >
            </div>

            <div class="relative">
              <label for="password_confirmation" class="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                v-model="form.password_confirmation"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 rounded-xl bg-gray-700/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 border border-transparent focus:border-purple-500"
                placeholder="••••••••"
              >
            </div>

            <div class="relative">
              <label for="avatar" class="block text-sm font-medium text-gray-300 mb-2">
                Avatar URL (Optional)
              </label>
              <input
                id="avatar"
                v-model="form.avatar"
                type="url"
                placeholder="https://example.com/your-avatar.jpg"
                class="w-full px-4 py-3 rounded-xl bg-gray-700/60 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 border border-transparent focus:border-purple-500"
              >
            </div>

            <div class="pt-3">
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <span v-if="!loading">Create Account</span>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
          </form>

          <div class="mt-2 text-center">
            <p class="text-sm text-gray-400">
              Already have an account?
              <NuxtLink to="/login" class="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"> Sign in
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
  title: 'Create Account - NTTC School',
});

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  avatar: '',
});

const errors = ref([]);
const loading = ref(false);

/**
 * Validates the form data on the client side.
 * Populates the `errors` array with any validation messages.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
const validateForm = () => {
  errors.value = [];

  if (!form.name.trim()) {
    errors.value.push('Full Name is required.');
  }

  // A more robust email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    errors.value.push('Please enter a valid email address.');
  }

  if (form.password.length < 6) {
    errors.value.push('Password must be at least 6 characters.');
  }

  if (form.password !== form.password_confirmation) {
    errors.value.push('Passwords do not match.');
  }

  // A more robust URL regex for the avatar field
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (form.avatar && !urlRegex.test(form.avatar)) {
    errors.value.push('Please enter a valid URL for your avatar.');
  }

  return errors.value.length === 0;
};

/**
 * Handles the form submission process.
 * Calls `validateForm` and then attempts to register the user via an API call.
 */
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  errors.value = [];

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.name,
        email: form.email,
        password: form.password,
        avatar: form.avatar,
      },
    });

    console.log('Registration successful:', response);
    await navigateTo('/login?registered=true');

  } catch (error) {
    console.error('Registration error object:', error);
    const apiError = error.response?._data?.statusMessage || error.data?.statusMessage;
    if (apiError) {
      errors.value.push(apiError);
    } else {
      errors.value.push('An unexpected error occurred. Please try again.');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Scoped styles are not needed with Tailwind CSS, but the tag is kept for convention. */
</style>
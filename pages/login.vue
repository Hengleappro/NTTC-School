<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    :style="{ backgroundImage: 'url(/NTTC-background.jpg)' }"
  > <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

    <div class="relative w-full max-w-md px-4">
      <div class="bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 shadow-xl overflow-hidden">
        <div class="p-8">
          <h1 class="text-3xl font-bold text-center text-white mb-8">Login</h1>

          <form class="space-y-6" @submit.prevent="submitLogin">
            <div v-if="errors.apiError" class="p-3 mb-4 bg-red-500/20 rounded-lg">
              <p class="text-sm text-red-200">{{ errors.apiError }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="email@example.com"
              />
              <p v-if="errors.email" class="mt-2 text-sm text-red-300">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label for="password" class="block text-sm font-medium text-white">
                  Password
                </label>
                <NuxtLink to="/forgot-password" class="text-sm text-blue-300 hover:text-blue-200">
                  Forgot password?
                </NuxtLink>
              </div>
              <input
                id="password"
                v-model="form.password"
                type="password"
                autocomplete="current-password"
                required
                class="w-full px-4 py-3 rounded-lg bg-white/90 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="••••••••"
              />
              <p v-if="errors.password" class="mt-2 text-sm text-red-300">
                {{ errors.password }}
              </p>
            </div>

            <div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Sign in</span>
                <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/20"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-transparent text-white"> Or continue with </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                @click="handleSocialLogin('google')"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300/50 rounded-lg shadow-sm bg-white/80 text-sm font-medium text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                <span class="ml-2">Sign in with Google</span>
              </button>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-sm text-white">
              Don't have an account?
              <NuxtLink to="/register" class="font-medium text-blue-300 hover:text-blue-200">
                Sign up
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
// navigateTo is auto-imported in Nuxt 3
// useHead is auto-imported for managing <head> elements

// Define page meta for title
useHead({
  title: 'Login - NTTC School',
});

const form = reactive({ // Using reactive for a nested object like form is often cleaner
  email: '',
  password: '',
});

const errors = reactive({
  email: null,
  password: null,
  apiError: null,
});

const loading = ref(false);

const validateForm = () => {
  // Reset previous errors
  errors.email = null;
  errors.password = null;
  errors.apiError = null;
  let isValid = true;

  if (!form.email || !form.email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
    isValid = false;
  }
  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
    isValid = false;
  }
  return isValid;
};

const submitLogin = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  errors.apiError = null; // Clear previous general API error

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: form.email,
        password: form.password,
      },
    });

    console.log('Login successful:', response.message, response.user);

    // --- Crucial Next Step: State Management ---
    // 1. You need an authentication store (e.g., using Pinia).
    //    Example: const authStore = useAuthStore();
    //             authStore.login(response.user); // This action would set isAuthenticated = true and store user details.

    // 2. For now, as a placeholder, you could store a simple flag or user info.
    //    This is NOT a complete solution for auth state.
    //    const loggedInUser = useState('loggedInUser', () => null); // Nuxt 3 shared state
    //    loggedInUser.value = response.user;

    // Redirect to a protected page (e.g., dashboard)
    // Ensure you have a `pages/dashboard.vue` file.
    await navigateTo('/'); // Changed from '/' to '/dashboard'

  } catch (err) {
    console.error('Login error details:', err);
    loading.value = false;

    // Error handling for $fetch errors
    if (err.response && err.response._data) {
      errors.apiError = err.response._data.statusMessage || err.response._data.message || 'Invalid credentials or server error.';
    } else if (err.data) { // Sometimes error details are in err.data
      errors.apiError = err.data.statusMessage || err.data.message || 'Invalid credentials or server error.';
    }
    else {
      errors.apiError = 'An unexpected error occurred. Please try again.';
    }
  }
  // No need to set loading.value = false here if successful, as it redirects.
  // It's already set in the catch block.
};

const handleSocialLogin = (provider) => {
  console.log(`Attempting to log in with ${provider}`);
  alert(`Social login with ${provider} is not implemented yet.`);
  // Example: window.location.href = `/api/auth/${provider}/redirect`;
};
</script>

<style scoped>
/* Your component-specific styles can go here if needed */
</style>
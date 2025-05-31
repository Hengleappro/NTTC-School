<template>
  <div
    class="min-h-screen flex items-center justify-center bg-cover bg-center"
    :style="{ backgroundImage: 'url(/background.jpg)' }"  
  > <div class="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
    
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

<script setup> // Changed to script setup for better Nuxt 3 Composition API experience
import { ref } from 'vue';
// import { useRouter } from 'vue-router'; // Not needed if using navigateTo
// navigateTo is auto-imported in Nuxt 3 <script setup>

// const router = useRouter(); // Not typically used for navigation this way in <script setup> with navigateTo

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '', // This field is for client-side check only
});

const errors = ref([]); // Will store error messages as strings
const loading = ref(false);

const submitForm = async () => {
  errors.value = []; // Clear previous errors
  loading.value = true;

  // Client-side validation
  if (form.value.password !== form.value.password_confirmation) {
    errors.value.push('Passwords do not match.');
    loading.value = false;
    return;
  }

  // Backend validation for password length is 6, but your form says 8.
  // Let's align or keep client-side more strict.
  // The backend User model has minlength: 6 for password.
  if (form.value.password.length < 6) { 
    errors.value.push('Password must be at least 6 characters.');
    loading.value = false;
    return;
  }
  if (!form.value.name.trim()) {
    errors.value.push('Full Name is required.');
    loading.value = false;
    return;
  }
  if (!form.value.email.includes('@')) { // Simple email check
    errors.value.push('Please enter a valid email address.');
    loading.value = false;
    return;
  }

  try {
    // Use $fetch for API calls in Nuxt 3
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        // You could also send role or bio if your form collected them,
        // but your current form only has name, email, password.
      },
    });

    console.log('Registration successful:', response.message, response.user);

    // Redirect to login page after successful registration (or directly to dashboard if you auto-login)
    // For now, let's redirect to login and they can sign in.
    await navigateTo('/login?registered=true'); // navigateTo is auto-imported in <script setup>

  } catch (error) {
    console.error('Registration error object:', error);
    loading.value = false;

    if (error.response && error.response._data && error.response._data.statusMessage) {
      // Handle errors from our backend (createError)
      errors.value.push(error.response._data.statusMessage);
    } else if (error.data && error.data.statusMessage) { // Another common structure for $fetch errors
        errors.value.push(error.data.statusMessage);
    }
    else {
      errors.value.push('An unexpected error occurred. Please try again.');
    }
  } finally {
    // Ensure loading is set to false if not already handled by error or success redirect.
    // This is mostly for cases where an error occurs before the API call.
    if (errors.value.length > 0) {
        loading.value = false;
    }
  }
};
</script>
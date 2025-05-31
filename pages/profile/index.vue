<script setup lang="ts">
import type { IUser, AuthApiResponse } from '~/server/models/User.ts';

const auth = useAuth();

// Fetch user data from the API
const { data: user, pending, error, refresh } = await useFetch<IUser | AuthApiResponse>('/api/auth/me', {
  // Set a default value for 'user' to avoid errors while data is pending on SSR
  default: () => ({ name: 'Guest', email: 'Loading...', id: '' }) as IUser, // Ensure 'id' is present for isUser check
});

// Computed property to confirm if the fetched data is a valid user object
const isUser = computed(() => {
  return user.value && 'id' in user.value && 'name' in user.value && 'email' in user.value;
});

// Function to manually refresh user data
const handleRefreshProfile = () => {
  refresh();
};

// Watch for authentication errors (e.g., 401 Unauthorized)
watchEffect(() => {
  if (error.value && error.value.statusCode === 401) {
    console.warn("User not authenticated, consider redirecting to login.");
    // Optional: Implement auto-redirect to login here if desired
    // navigateTo('/login');
  }
});
</script>

<template>
  <div class="container mx-auto p-6 shadow-lg rounded-lg max-w-2xl mt-24 mb-12 relative min-h-[300px]">
    <h1 class="text-3xl font-bold mb-6 border-b pb-4">User Profile</h1>

    <div v-if="pending" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="flex flex-col items-center space-y-4">
        <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xl font-medium text-gray-700">Loading Profile...</span>
      </div>
    </div>

    <div v-else>
      <div v-if="error" class="text-center py-8">
        <p class="text-red-600 text-lg">Error loading profile: {{ error.message }}</p>
        <button @click="handleRefreshProfile" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Try Again
        </button>
      </div>

      <div v-else-if="user && isUser && auth.isLoggedIn.value" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1 flex flex-col items-center">
          <img
            :src="user.avatar || 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1748687064/nntxtbglhwulptxc1wfn.png'"
            alt="User Avatar"
            class="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-md"
          />
          <h2 class="text-xl font-semibold  mt-4">{{ user.name }}</h2>
          <p class="text-md ">{{ user.email }}</p>

          
          </div>

        <div class="md:col-span-2">
          <h3 class="text-2xl font-semibold  mb-4">Details</h3>
          
          <div class="mb-4">
            <p class=" font-medium">Email:</p>
            <p class="">{{ user.email }}</p>
          </div>
          
          <div class="mb-4">
            <p class="font-medium">User bio:</p>
            <p class="">{{ user.bio }}</p>
          </div>

          <div v-if="user.bio" class="mb-4">
            <p class="text-gray-600 font-medium">Bio:</p>
            <p class="text-gray-800">{{ user.bio }}</p>
          </div>
          <button @click="handleRefreshProfile" class="mt-6 px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
            Refresh Profile
          </button>
          <NuxtLink to="/profile/edit" class="ml-4 px-5 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300">
            Edit Profile
          </NuxtLink>
        </div>
      </div>

      <div v-else class="text-center py-8">
        <p class="text-lg text-gray-600">No profile data available. Please log in.</p>
        <NuxtLink to="/login" class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go to Login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the spin animation is defined, either here or globally */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
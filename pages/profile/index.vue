<script setup lang="ts">
import type { IUser, AuthApiResponse } from '~/types'; // Adjust path if your types are elsewhere

const auth = useAuth();


const { data: user, pending, error, refresh } = await useFetch<IUser | AuthApiResponse>('/api/auth/me', {
  // Optional: Set default value for data while pending, useful for initial SSR
  default: () => ({ name: 'Guest', email: 'Loading...' }) as IUser,
});

// A computed property to check if the fetched data is indeed a user object
// This handles the case where AuthApiResponse might not be an IUser
const isUser = computed(() => {
  return user.value && 'id' in user.value && 'name' in user.value && 'email' in user.value;
});

// Function to refresh user data, e.g., after an update
const handleRefreshProfile = () => {
  refresh();
};

watchEffect(() => {
  if (error.value && error.value.statusCode === 401) {
    console.warn("User not authenticated, consider redirecting to login.");
  }
});
</script>

<template v-if="auth.isLoggedIn.value">
  <div class="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl mt-24 mb-12">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">User Profile</h1>

    <div v-if="pending" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading profile data...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 text-lg">Error loading profile: {{ error.message }}</p>
      <button @click="handleRefreshProfile" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>

    <div v-else-if="user && isUser" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-1 flex flex-col items-center">
        <img
          :src="user.avatar || 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1748687064/nntxtbglhwulptxc1wfn.png'"
          alt="User Avatar"
          class="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-md"
        />
        <h2 class="text-xl font-semibold text-gray-700 mt-4">{{ user.name }}</h2>
        <p class="text-md text-gray-500">{{ user.email }}</p>
      </div>

      <div class="md:col-span-2">
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Details</h3>
        
        <div class="mb-4">
          <p class="text-gray-600 font-medium">Email:</p>
          <p class="text-gray-800">{{ user.email }}</p>
        </div>
        
        <div class="mb-4">
          <p class="text-gray-600 font-medium">User bio:</p>
          <p class="text-gray-800">{{ user.bio }}</p>
        </div>

        <div v-if="user.bio" class="mb-4">
          <p class="text-gray-600 font-medium">Bio:</p>
          <p class="text-gray-800">{{ user.bio }}</p>
        </div>
        <button @click="handleRefreshProfile" class="mt-6 px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
          Refresh Profile
        </button>
        <!-- <NuxtLink to="/profile/edit" class="ml-4 px-5 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-300">
          Edit Profile
        </NuxtLink> -->
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-lg text-gray-600">No profile data available. Please log in.</p>
      <NuxtLink to="/login" class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Login
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add some basic styling if not using a framework like Tailwind CSS */
/* You might include a global CSS file or use a CSS framework */
</style>
<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { IUser, AuthApiResponse } from '~/types'; // Adjust path if your types are elsewhere

const router = useRouter();

// 1. Fetch current user data to pre-populate the form
const { data: userData, pending, error, refresh } = await useFetch<IUser | AuthApiResponse>('/api/auth/me', {
  lazy: true, // Use lazy loading if you want the page to load first, then data
  default: () => null // Set default to null or an empty user object
});

// Reactive state for the form fields
// Initialize with empty strings or null, and update when userData is available
const name = ref('');
const email = ref('');
const bio = ref('');
const avatarUrl = ref('');

// Watch for changes in userData and populate form fields
watch(userData, (newVal) => {
  if (newVal && 'id' in newVal) { // Check if it's an IUser object
    name.value = newVal.name || '';
    email.value = newVal.email || '';
    bio.value = newVal.bio || '';
    avatarUrl.value = newVal.avatarUrl || '';
  }
}, { immediate: true }); // Run immediately on component mount

// Loading and Error states for the form submission
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);

const isUserLoaded = computed(() => userData.value && 'id' in userData.value);

// Form submission handler
async function handleUpdateProfile() {
  isSubmitting.value = true;
  submitError.value = null;
  submitSuccess.value = false;

  try {
    // Validate basic input (more complex validation would use a library)
    if (!name.value || !email.value) {
      throw new Error('Name and Email are required.');
    }
    if (!email.value.includes('@')) {
      throw new Error('Invalid email format.');
    }

    // Prepare the payload for the API
    const updatedProfile = {
      name: name.value,
      email: email.value,
      bio: bio.value,
      avatarUrl: avatarUrl.value,
      // You might also include the ID if your API requires it for identification
      id: isUserLoaded.value ? (userData.value as IUser).id : undefined
    };

    // Use $fetch for the POST/PUT request to update the profile
    // Assuming your API endpoint for updating a profile is /api/auth/profile or /api/auth/me
    const response = await $fetch<IUser>('/api/auth/profile', { // Or '/api/auth/me' if it handles PUT
      method: 'PUT', // Or 'PATCH' depending on your API
      body: updatedProfile,
      // headers: {
      //   Authorization: `Bearer ${yourAuthToken}` // Include auth token if needed
      // }
    });

    submitSuccess.value = true;
    console.log('Profile updated successfully:', response);

    // Optionally:
    // 1. Refresh the data on the main profile page (if you return there)
    // 2. Navigate back to the profile view page
    setTimeout(() => {
      router.push('/profile'); // Navigate back to the profile view
    }, 1500); // Give user time to see success message

  } catch (e: any) {
    console.error('Error updating profile:', e);
    submitError.value = e.data?.message || e.message || 'An unknown error occurred.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-2xl mt-10">
    <h1 class="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Edit Profile</h1>

    <div v-if="pending" class="text-center py-8">
      <p class="text-lg text-gray-600">Loading current profile data...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600 text-lg">Error loading current profile: {{ error.message }}</p>
      <button @click="refresh" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
      <NuxtLink to="/profile" class="ml-4 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
        Back to Profile
      </NuxtLink>
    </div>

    <form v-else-if="isUserLoaded" @submit.prevent="handleUpdateProfile" class="space-y-6">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          v-model="name"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div>
        <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          id="bio"
          v-model="bio"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        ></textarea>
      </div>

      <div>
        <label for="avatarUrl" class="block text-sm font-medium text-gray-700">Avatar URL</label>
        <input
          type="url"
          id="avatarUrl"
          v-model="avatarUrl"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <p class="mt-2 text-sm text-gray-500">Paste a direct link to your profile picture.</p>
      </div>

      <div v-if="submitError" class="text-red-600 text-sm mt-4 p-3 bg-red-50 rounded-md border border-red-200">
        {{ submitError }}
      </div>
      <div v-if="submitSuccess" class="text-green-600 text-sm mt-4 p-3 bg-green-50 rounded-md border border-green-200">
        Profile updated successfully! Redirecting...
      </div>

      <div class="flex justify-end space-x-4 pt-4 border-t">
        <NuxtLink to="/profile" class="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300">
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
        >
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

    <div v-else class="text-center py-8">
      <p class="text-lg text-gray-600">Could not load profile data for editing. Please ensure you are logged in.</p>
      <NuxtLink to="/login" class="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Go to Login
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add basic styling if not using a framework like Tailwind CSS */
</style>
<template>
  <div class="user-management min-h-screen pt-12 pb-10 md:pt-24">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 class="text-3xl font-bold ">User Management</h1>
        <button
          @click="showCreateForm"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150 ease-in-out w-full sm:w-auto"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Create User
        </button>
      </div>

      <div v-if="apiErrors.length > 0" class="my-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-md shadow-sm" role="alert">
        <div class="flex">
          <div class="py-1">
            <svg class="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg>
          </div>
          <div>
            <p class="font-bold">Please correct the following errors:</p>
            <ul class="list-disc list-inside text-sm">
              <li v-for="(error, index) in apiErrors" :key="index">{{ error }}</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div v-if="showForm" class="bg-white rounded-lg shadow-xl p-6 mb-8 border border-gray-200">
        <h2 class="text-2xl font-semibold mb-6 text-gray-700">{{ formTitle }}</h2>
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="userForm.name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                v-model="userForm.email"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password <span v-if="isEditMode" class="text-xs text-gray-500">(leave blank to keep current)</span></label>
              <input
                type="password"
                id="password"
                v-model="userForm.password"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                :required="!isEditMode"
                autocomplete="new-password"
              />
            </div>
            <div>
              <label for="role" class="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                id="role"
                v-model="userForm.role"
                class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div>
            <label for="bio" class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              id="bio"
              v-model="userForm.bio"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <div>
            <label for="avatar" class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input
              type="url"
              id="avatar"
              v-model="userForm.avatar"
              class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/your-avatar.jpg"
            />
            <p class="mt-1 text-xs text-gray-500">Provide a direct link to the user's avatar image.</p>
          </div>
          
          <div class="flex justify-end space-x-3 pt-4">
            <button
              @click="cancelEdit"
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Processing...</span>
              <span v-else>{{ isEditMode ? 'Update User' : 'Create User' }}</span>
            </button>
          </div>
        </form>
      </div>
      
      <div class="users-list space-y-4">
        <div 
          v-for="user in users" 
          :key="user.id" 
          class="user-card flex flex-col sm:flex-row items-start p-4 sm:p-5 rounded-lg bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-200"
        >
          <div class="user-avatar flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full mr-0 sm:mr-4 mb-3 sm:mb-0 text-lg font-semibold bg-blue-100 text-blue-600 overflow-hidden">
            <img
              v-if="user.avatar && user.avatar.startsWith('http')"
              :src="user.avatar"
              :alt="user.name"
              class="w-full h-full object-cover"
            />
            <span v-else>
              {{ user.name.charAt(0).toUpperCase() }}
            </span>
          </div>
          
          <div class="user-info flex-1 w-full">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <h3 class="font-medium text-lg text-gray-900">{{ user.name }}</h3>
              <span 
                :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'" 
                class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 sm:mt-0"
              >
                {{ user.role.charAt(0).toUpperCase() + user.role.slice(1) }}
              </span>
            </div>
            <p class="text-sm text-gray-600 mt-1">Email: {{ user.email }}</p>
            <p class="text-sm text-gray-500 mt-2" v-if="user.bio">Bio: {{ user.bio }}</p>
            
            <div class="user-actions flex gap-3 mt-3 pt-2 border-t border-gray-100 sm:border-t-0 sm:pt-0">
              <button
                @click="editUser(user)"
                class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Edit
              </button>
              <button
                @click="confirmDelete(user)"
                class="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="!isLoading && users.length === 0 && !showForm" class="bg-white rounded-lg shadow-sm p-8 text-center mt-8 border border-gray-200">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0zM12 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900">No users found</h3>
        <p class="mt-2 text-sm text-gray-500">Get started by creating a new user.</p>
        <div class="mt-6">
          <button
            @click="showCreateForm"
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Create New User
          </button>
        </div>
      </div>
      
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-out" :class="showDeleteModal ? 'opacity-100' : 'opacity-0 pointer-events-none'">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ease-out" :class="showDeleteModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'">
          <div class="flex items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Confirm Deletion
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Are you sure you want to delete user <strong class="text-gray-700">{{ userToDelete?.name }}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              @click="deleteUser"
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              :disabled="isLoading"
            >
             <span v-if="isLoading">Deleting...</span>
             <span v-else>Delete</span>
            </button>
            <button
              @click="showDeleteModal = false"
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
              :disabled="isLoading"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

       <div v-if="isLoading && !showForm && !showDeleteModal" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <div class="flex items-center space-x-2">
          <svg class="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-xl font-medium text-gray-700">Loading Users...</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// User data model for the form
const userForm = ref({
  id: null, // Will store string ID from backend
  name: '',
  email: '',
  password: '', // Only send if changing/creating
  role: 'user',
  bio: '',
  avatar: '', // NEW: Add avatar to userForm
});

const users = ref([]);
const isEditMode = ref(false);
const showForm = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref(null); 
const apiErrors = ref([]); 
const isLoading = ref(false);

const formTitle = computed(() => {
  return isEditMode.value ? 'Edit User Details' : 'Create New User';
});

const showCreateForm = () => {
  resetForm();
  isEditMode.value = false;
  showForm.value = true;
  apiErrors.value = []; 
};

// Fetch users from API
const fetchUsers = async () => {
  isLoading.value = true;
  apiErrors.value = [];
  try {
    // UPDATED PATH: Ensure this endpoint also returns the 'avatar' field for each user
    const fetchedUsers = await $fetch('/api/auth'); 
    users.value = fetchedUsers || []; 
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = []; 
    const errorMessage = error.data?.statusMessage || error.message || 'Failed to load users. Please check your connection or try again.';
    apiErrors.value.push(errorMessage);
  } finally {
    isLoading.value = false;
  }
};

const submitForm = async () => {
  apiErrors.value = []; 

  // Client-side validation
  if (!userForm.value.name.trim()) apiErrors.value.push("Full Name is required.");
  if (!userForm.value.email.trim() || !userForm.value.email.includes('@')) {
    apiErrors.value.push("A valid Email is required.");
  }
  if (!isEditMode.value && !userForm.value.password) {
    apiErrors.value.push("Password is required for new users.");
  }
  if (userForm.value.password && userForm.value.password.length < 6) {
    apiErrors.value.push("Password must be at least 6 characters.");
  }
  // NEW: Basic avatar URL validation for the form
  if (userForm.value.avatar && !userForm.value.avatar.startsWith('http')) {
    apiErrors.value.push("Avatar URL must be a valid http/https URL.");
  }

  if (apiErrors.value.length > 0) return; 

  isLoading.value = true;
  try {
    let response;
    const payload = {
      name: userForm.value.name,
      email: userForm.value.email.toLowerCase(), 
      role: userForm.value.role,
      bio: userForm.value.bio,
      avatar: userForm.value.avatar, // NEW: Include avatar in payload
    };
    if (userForm.value.password) { 
      payload.password = userForm.value.password;
    }

    if (isEditMode.value) {
      console.log('Attempting to update user:', userForm.value.id, payload);
      // Ensure backend /api/auth/:id (PUT) accepts and saves 'avatar'
      response = await $fetch(`/api/auth/${userForm.value.id}`, { 
        method: 'PUT',
        body: payload
      });
      console.log('User updated:', response.user);
    } else {
      console.log('Attempting to create user:', payload);
      // Ensure backend /api/auth (POST) accepts and saves 'avatar'
      response = await $fetch('/api/auth', { 
        method: 'POST',
        body: payload
      });
      console.log('User created:', response.user);
    }
    
    resetForm();
    showForm.value = false;
    await fetchUsers(); 
  } catch (error) {
    console.error('Error saving user:', error);
    const errorMessage = error.data?.statusMessage || error.message || 'An unexpected error occurred while saving the user.';
    apiErrors.value.push(errorMessage);
  } finally {
    isLoading.value = false;
  }
};

// Edit user: Populate form with user data
const editUser = (userToEdit) => {
  apiErrors.value = [];
  userForm.value = {
    id: userToEdit.id, 
    name: userToEdit.name,
    email: userToEdit.email,
    password: '', 
    role: userToEdit.role,
    bio: userToEdit.bio || '',
    avatar: userToEdit.avatar || '', // NEW: Populate avatar field for editing
  };
  isEditMode.value = true;
  showForm.value = true;
};

// Cancel edit/create
const cancelEdit = () => {
  showForm.value = false;
  resetForm();
  apiErrors.value = [];
};

// Reset form to initial state
const resetForm = () => {
  userForm.value = {
    id: null,
    name: '',
    email: '',
    password: '',
    role: 'user',
    bio: '',
    avatar: '', // NEW: Reset avatar field
  };
  isEditMode.value = false; 
};

// Confirm delete: Show modal and set user to delete
const confirmDelete = (user) => {
  apiErrors.value = [];
  userToDelete.value = user; 
  showDeleteModal.value = true;
};

// Delete user
const deleteUser = async () => {
  if (!userToDelete.value || !userToDelete.value.id) return;
  
  isLoading.value = true; 
  apiErrors.value = [];
  try {
    console.log('Deleting user:', userToDelete.value.id);
    await $fetch(`/api/auth/${userToDelete.value.id}`, { 
      method: 'DELETE'
    });
    console.log('User deleted successfully');
    
    showDeleteModal.value = false;
    userToDelete.value = null;
    await fetchUsers(); 
  } catch (error) {
    console.error('Error deleting user:', error);
    const errorMessage = error.data?.statusMessage || error.message || 'Failed to delete user. Please try again.';
    apiErrors.value.push(errorMessage);
  } finally {
    isLoading.value = false; 
  }
};

// Initialize component: Fetch users when mounted
onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>

input[type="text"],
input[type="email"],
input[type="password"],
select,
textarea {
  @apply transition-colors duration-150 ease-in-out;
}

.fixed.inset-0.bg-gray-800 { 
  transition: opacity 0.3s ease-out;
}
.fixed.inset-0.bg-gray-800 > div { 
    transition: all 0.3s ease-out;
}

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
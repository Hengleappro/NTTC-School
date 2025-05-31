<template>
  <div class="courses-page">
    <h1 class="font-bold text-center text-2xl mb-8 mt-12">Free Courses</h1>
    
    <button @click="openModal(null)" class="mt-4 mb-6 px-4 py-2 bg-blue-500 text-white rounded ml-4 hover:bg-blue-800" v-if="isAdmin">New Course</button>
    
    <div v-if="pending && !showModal && !showDeleteModal" class="text-center py-10">
      <p class="text-lg text-gray-600">Loading courses...</p>
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mt-4"></div>
    </div>
    
    <div v-else-if="error" class="text-center py-10 text-red-600">
      <p class="text-red-600 text-lg">Error loading courses: {{ error.message }}</p>
      <button @click="refresh" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Try Again
      </button>
    </div>
    
    <div v-else-if="courses && courses.length > 0" class="course-list">
      <div v-for="course in courses" :key="course._id" class="course-card">
        <img 
          :src="course.image" 
          :alt="course.title" 
          class="course-image"
          loading="lazy"
        >
        <h2 class="font-bold text-lg mt-4">{{ course.title }}</h2>
        <p class="text-gray-600 mt-2">{{ course.description }}</p>
        <div class="flex justify-between items-center mt-4">
          <NuxtLink 
            :to="`/courses/${course._id}`" 
            class="view-btn"
          >
            View Course
          </NuxtLink>
          <div>
            <button @click="openModal(course)" class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded mr-2" v-if="isAdmin">Edit</button>
            <button @click="confirmDelete(course._id)" class="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded" v-if="isAdmin">Delete</button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-10 text-gray-600">No courses available yet.</div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-xl font-bold mb-4 text-gray-900">{{ currentCourse._id ? 'Edit Course' : 'Add Course' }}</h2>
        <form @submit.prevent="saveCourse">
          <div class="mb-4">
            <label class="block mb-2 text-gray-600">Title</label>
            <input v-model="currentCourse.title" class="w-full p-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block mb-2 text-gray-600">Description</label>
            <textarea v-model="currentCourse.description" class="w-full p-2 border rounded" required></textarea>
          </div>
          
          <div class="mb-4">
            
            <label class="block mb-2 text-gray-600 mt-4">Image URL (or use uploaded)</label>
            <img v-if="currentCourse.image" :src="currentCourse.image" class="w-32 h-32 object-cover rounded-md mb-2">
            <input v-model="currentCourse.image" type="text" placeholder="Enter image URL" class="w-full p-2 border rounded">
          </div>

          <div class="mb-4">
            <label class="block mb-2 text-gray-600">Duration (e.g., 8 hours)</label>
            <input v-model="currentCourse.duration" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <label class="block mb-2 text-gray-600">Level</label>
            <select v-model="currentCourse.level" class="w-full p-2 border rounded">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div class="flex justify-end space-x-2">
            <button @click="closeModal" type="button" class="px-4 py-2 bg-gray-300 hover:bg-gray-600 text-gray-800 hover:text-white rounded">Cancel</button>
            <button type="submit" :disabled="uploadingImage" class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed">
              {{ currentCourse._id ? 'Update' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-bold mb-2 text-gray-900">Confirm Delete</h3>
        <p class="mb-4 text-gray-600">Are you sure you want to delete this course?</p>
        <div class="flex justify-end space-x-2">
          <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-300 hover:bg-gray-600 text-gray-800 hover:text-white rounded">Cancel</button>
          <button @click="deleteCourse" class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="pending && !showModal && !showDeleteModal" class="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div class="flex flex-col items-center space-y-4">
        <svg class="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-xl font-medium text-gray-700">Loading Courses...</span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAsyncData, useHead, useRuntimeConfig } from '#app';

const DEFAULT_IMAGE_PLACEHOLDER = 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1747680306/cdfbh5gywxw9dvh581v6.jpg';

const { public: publicConfig } = useRuntimeConfig();
const { isAdmin, isLoggedIn } = useAuth();
const showModal = ref(false);
const showDeleteModal = ref(false);
const currentCourse = ref({
  _id: null,
  title: '',
  description: '',
  image: DEFAULT_IMAGE_PLACEHOLDER,
  duration: '8 hours',
  level: 'Intermediate',
});
const courseToDeleteId = ref(null);
const uploadingImage = ref(false);
const imageUploadError = ref(null);

const { data: courses, pending, error, refresh } = await useAsyncData(
  'courses',
  () => $fetch('/api/courses')
);

useHead({
  title: 'Courses | NTTC-School'
});

async function handleImageFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    imageUploadError.value = 'Please select an image file.';
    return;
  }

  uploadingImage.value = true;
  imageUploadError.value = null;

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    currentCourse.value.image = response.url;
    console.log('Image uploaded successfully:', response.url);
  } catch (err) {
    console.error('Error uploading image:', err);
    imageUploadError.value = err.data?.statusMessage || 'Unknown error occurred during upload.';
    currentCourse.value.image = DEFAULT_IMAGE_PLACEHOLDER;
  } finally {
    uploadingImage.value = false;
  }
}

function openModal(course) {
  currentCourse.value = course ? { ...course } : {
    _id: null,
    title: '',
    description: '',
    image: DEFAULT_IMAGE_PLACEHOLDER,
    duration: '8 hours',
    level: 'Intermediate',
  };
  imageUploadError.value = null;
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  currentCourse.value = {
    _id: null,
    title: '',
    description: '',
    image: DEFAULT_IMAGE_PLACEHOLDER,
    duration: '8 hours',
    level: 'Intermediate',
  };
  imageUploadError.value = null;
}

async function saveCourse() {
  if (uploadingImage.value) {
    alert('Please wait for the image to finish uploading.');
    return;
  }

  if (!currentCourse.value.image || currentCourse.value.image === DEFAULT_IMAGE_PLACEHOLDER && currentCourse.value._id === null) {
      alert('Thumbnail image is required for a new course.');
      return;
  }

  try {
    if (currentCourse.value._id) {
      await $fetch(`/api/courses/${currentCourse.value._id}`, {
        method: 'PUT',
        body: currentCourse.value,
      });
      alert('Course updated successfully!');
    } else {
      await $fetch('/api/courses', {
        method: 'POST',
        body: currentCourse.value,
      });
      alert('Course added successfully!');
    }
    closeModal();
    refresh();
  } catch (e) {
    console.error('Error saving course:', e);
    alert('Failed to save course: ' + (e.data?.statusMessage || e.message));
  }
}

function confirmDelete(id) {
  courseToDeleteId.value = id;
  showDeleteModal.value = true;
}

async function deleteCourse() {
  try {
    await $fetch(`/api/courses/${courseToDeleteId.value}`, {
      method: 'DELETE',
    });
    alert('Course deleted successfully!');
    showDeleteModal.value = false;
    courseToDeleteId.value = null;
    refresh();
  } catch (e) {
    console.error('Error deleting course:', e);
    alert('Failed to delete course: ' + (e.data?.statusMessage || e.message));
  }
}
</script>

<style scoped>
/* Your existing styles */
.courses-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 150px);
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.course-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 6px;
}

.view-btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.view-btn:hover {
  background-color: #2980b9;
}

@media (max-width: 768px) {
  .course-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

/* New/Modified styles for the global loading overlay */
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
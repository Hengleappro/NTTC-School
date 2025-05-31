<!-- \pages\courses\index.vue -->

<template>
  <div class="courses-page">
    <h1 class="font-bold text-center text-2xl mb-8 mt-12">Free Courses</h1>
    
    <button @click="openModal(null)" class="mt-4 mb-6 px-4 py-2 bg-blue-500 text-white rounded ml-4 hover:bg-blue-800">New Course</button>
    
    <div v-if="pending" class="text-center py-10">Loading courses...</div>
    <div v-else-if="error" class="text-center py-10 text-red-600">Error loading courses: {{ error.message }}</div>
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
            <button @click="openModal(course)" class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded mr-2" v-if="auth.isAdmin.value">Edit</button>
            <button @click="confirmDelete(course._id)" class="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded" v-if="auth.isAdmin.value">Delete</button>
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
            <label class="block mb-2 text-gray-600">Image URL</label>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'; // Removed watchEffect as it's not directly used in the simplified flow
import { useAsyncData, useHead, useRuntimeConfig } from '#app'; // Import useRuntimeConfig

// Types for better clarity (optional, but good practice)
/**
 * @typedef {Object} Course
 * @property {string} _id
 * @property {string} title
 * @property {string} image - Cloudinary URL
 * @property {string} description
 * @property {string} [duration]
 * @property {'Beginner' | 'Intermediate' | 'Advanced'} [level]
 * @property {Array} [lessons]
 */

const { public: publicConfig } = useRuntimeConfig();
const auth = useAuth();
// --- State Management ---
const showModal = ref(false);
const showDeleteModal = ref(false);
const currentCourse = ref({
  _id: null, // Use _id for MongoDB documents
  title: '',
  description: '',
  image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1747680306/cdfbh5gywxw9dvh581v6.jpg', // Default placeholder image
  duration: '8 hours',
  level: 'Intermediate',
});
const courseToDeleteId = ref(null);
const uploadingImage = ref(false); // Still keep this, though its usage will be minimal
const imageUploadError = ref(null); // Still keep this, though its usage will be minimal

// --- Fetch Courses ---
const { data: courses, pending, error, refresh } = await useAsyncData(
  'courses', // Unique key for this fetch operation
  () => $fetch('/api/courses') // Your API endpoint
);

// --- Head for page title ---
useHead({
  title: 'Courses | NTTC-School'
});

// --- Image Upload Logic (Temporarily commented out for testing) ---
// async function handleImageFileSelect(event) {
//   const file = event.target.files[0];
//   if (!file) return;

//   if (!file.type.startsWith('image/')) {
//     imageUploadError.value = 'Please select an image file.';
//     return;
//   }

//   uploadingImage.value = true;
//   imageUploadError.value = null;

//   const formData = new FormData();
//   formData.append('image', file);

//   try {
//     const response = await $fetch('/api/upload', {
//       method: 'POST',
//       body: formData,
//     });
//     currentCourse.value.image = response.url;
//     console.log('Image uploaded successfully:', response.url);
//   } catch (err) {
//     console.error('Error uploading image:', err);
//     imageUploadError.value = err.data?.statusMessage || 'Unknown error occurred during upload.';
//     currentCourse.value.image = '';
//   } finally {
//     uploadingImage.value = false;
//   }
// }

// --- Modal Actions ---
function openModal(course) {
  currentCourse.value = course ? { ...course } : {
    _id: null,
    title: '',
    description: '',
    image: '', // Set default image for new course
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
    image: '', // Reset to default image on close
    duration: '8 hours',
    level: 'Intermediate',
  };
  imageUploadError.value = null;
}

// --- CRUD Operations ---
async function saveCourse() {
  // if (uploadingImage.value) { // This check is less relevant if file upload is commented out
  //   alert('Please wait for the image to finish uploading.');
  //   return;
  // }
  // Temporarily comment out the image required alert for new courses
  // if (!currentCourse.value.image && currentCourse.value._id === null) {
  //     alert('Thumbnail image is required for a new course.');
  //     return;
  // }

  try {
    if (currentCourse.value._id) {
      // Update existing course
      await $fetch(`/api/courses/${currentCourse.value._id}`, {
        method: 'PUT',
        body: currentCourse.value,
      });
      alert('Course updated successfully!');
    } else {
      // Add new course
      await $fetch('/api/courses', {
        method: 'POST',
        body: currentCourse.value,
      });
      alert('Course added successfully!');
    }
    closeModal();
    refresh(); // Re-fetch courses to update the list
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
    refresh(); // Re-fetch courses to update the list
  } catch (e) {
    console.error('Error deleting course:', e);
    alert('Failed to delete course: ' + (e.data?.statusMessage || e.message));
  }
}
</script>

<style scoped>
/* Your original CSS remains completely unchanged */
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
</style>
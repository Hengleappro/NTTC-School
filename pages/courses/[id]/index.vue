<!-- \pages\courses\[id]\index.vue -->

<template>
  <div class="course-page">
    <div v-if="pending" class="text-center py-10">Loading course details...</div>
    <div v-else-if="error" class="text-center py-10 text-red-600">Error loading course: {{ error.message }}</div>

    <div v-else-if="course">
   
      <div class="course-header">
        <div class="breadcrumb">
          <NuxtLink to="/courses" class="text-blue-600 hover:underline">All Courses</NuxtLink>
          <span class="mx-2">/</span>
          <span>{{ course.title }}</span>
        </div>
        <h1 class="course-title">{{ course.title }}</h1>
        <div class="course-meta">
          <span class="badge">{{ course.lessons.length }} Lessons</span>
          <span class="badge">{{ course.duration || '8 Hours' }} Total</span>
          <span class="badge">{{ course.level || 'Intermediate' }} Level</span>
        </div>
      </div>

      <div class="course-content">
        <div class="course-image-container">
          <img 
            :src="course.image" 
            :alt="course.title" 
            class="course-image"
            loading="lazy"
          >
          <div class="course-description" v-if="course.description">
            <h3>About This Course</h3>
            <p>{{ course.description }}</p>
          </div>
        </div>

        <div class="lessons-section">
          <div class="section-header">
            <div class="flex justify-between items-center">
              <div>
                <h2>Course Content</h2>
                <p>{{ course.lessons.length }} lessons • {{ course.duration || '8 hours' }} total length</p>
              </div>
              <button v-if="isAdmin" @click="openAddLessonModal" class="add-lesson-btn"  >+ Add Lesson</button>
            </div>
          </div>
          
          <div class="lessons-list">
            <div 
              v-for="(lesson, index) in course.lessons" 
              :key="lesson._id" 
              class="lesson-card"
            >
              <div class="lesson-number">{{ index + 1 }}</div>
              <div class="lesson-info">
                <NuxtLink 
                  :to="`/courses/${course._id}/lessons/${lesson._id}`" 
                  class="hover:text-blue-600 font-semibold"
                >
                  {{ lesson.title }}
                </NuxtLink>
                <div class="lesson-meta">
                  <span class="duration">{{ lesson.duration || '45 min' }}</span>
                  <span v-if="lesson.free" class="free-badge">Free</span>
                  <div class="lesson-actions" v-if="isAdmin">
                    <button @click.stop="editLesson(lesson)" class="edit-lesson-btn" v-if="isAdmin">Edit</button>
                    <button @click.stop="confirmDelete('lesson', lesson._id)" class="delete-lesson-btn" v-if="isAdmin">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10 text-gray-600">Course not found.</div>


    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="text-gray-900 mt-0 mb-3 font-bold text-xl">{{ isEditingLesson ? (editingLessonId ? 'Edit Lesson' : 'Add Lesson') : 'Edit Course' }}</h3>
        
        <form @submit.prevent="saveChanges">
          <div v-if="!isEditingLesson" class="form-group">
            <label class="text-gray-900">Title</label>
            <input v-model="editableCourse.title" required>
          </div>
          
          <div v-if="!isEditingLesson" class="form-group">
            <label class="text-gray-900">Description</label>
            <textarea v-model="editableCourse.description" required></textarea>
          </div>
          
          <div v-if="!isEditingLesson" class="form-group">
            <label class="block mb-2 text-gray-600">Current Image</label>
            <img v-if="editableCourse.image" :src="editableCourse.image" class="w-32 h-32 object-cover rounded-md mb-2">
            <label class="block mb-2 text-gray-600">Upload New Image (Optional)</label>
            <input type="file" @change="handleImageFileSelect" accept="image/*" class="w-full p-2 border rounded">
            <p v-if="uploadingImage" class="text-blue-500 text-sm mt-1">Uploading image...</p>
            <p v-if="imageUploadError" class="text-red-500 text-sm mt-1">Error uploading image: {{ imageUploadError }}</p>
          </div>
          
          <div v-if="!isEditingLesson" class="form-group">
            <label class="text-gray-900">Duration</label>
            <input v-model="editableCourse.duration">
          </div>
          
          <div v-if="!isEditingLesson" class="form-group">
            <label class="text-gray-900"> Level</label>
            <select v-model="editableCourse.level">
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div v-if="isEditingLesson" class="form-group">
            <label class="text-gray-600">Lesson Title</label>
            <input v-model="editableLesson.title" required>
          </div>
          
          <div v-if="isEditingLesson" class="form-group">
            <label class="text-gray-600">Duration</label>
            <input v-model="editableLesson.duration">
          </div>
         
          <div v-if="isEditingLesson" class="form-group">
            <label class="text-gray-600">
              Free Lesson
              <input type="checkbox" v-model="editableLesson.free">
            </label>
          </div>

          <div class="modal-buttons">
            <button type="button" @click="closeModal" class="px-4 py-2 bg-gray-400 hover:bg-gray-700 text-white rounded">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded">Save</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="text-gray-900 font-bold text-xl mb-2">Confirm Delete</h3>
        <p class="text-gray-600">Are you sure you want to delete this {{ deleteType }}?</p>
        <div class="modal-buttons">
          <button @click="showDeleteModal = false" class="px-4 py-2 bg-gray-300 hover:bg-gray-600 text-white rounded">Cancel</button>
          <button @click="executeDelete" class="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'; // Import watch
import { useRoute, useRouter, useAsyncData, useHead } from '#app';

const route = useRoute();
const router = useRouter();
const { isAdmin, isLoggedIn } = useAuth();
const courseId = route.params.id; // This will be the MongoDB _id

// --- State Management ---
const showModal = ref(false);
const showDeleteModal = ref(false);
const deleteType = ref(''); // 'course' or 'lesson'
const itemToDelete = ref(null); // Holds courseId or lesson._id

const isEditingLesson = ref(false);
const editingLessonId = ref(null); // Holds lesson._id

const editableCourse = ref({
  _id: null, // MongoDB _id
  title: '',
  description: '',
  image: '',
  duration: '',
  level: '',
  lessons: []
});

const editableLesson = ref({
  _id: null, // MongoDB _id
  title: '',
  duration: '',
  link: '',
  free: false
});

const uploadingImage = ref(false);
const imageUploadError = ref(null);

// --- Fetch Course Data ---
// Use useAsyncData to fetch the single course by its ID
const { data: course, pending, error, refresh } = await useAsyncData(
  `course-${courseId}`, // Unique key for this specific course
  () => $fetch(`/api/courses/${courseId}`), // API endpoint to fetch a single course
  {
    // Watch the route param to re-fetch if the ID changes (though usually not for a static page)
    watch: [() => route.params.id]
  }
);

// Watch for changes in the `course` data to update the page title
watch(course, (newCourse) => {
  if (newCourse) {
    useHead({
      title: `${newCourse.title} | NTTC-School`
    });
  } else {
    useHead({
      title: `Course Not Found | NTTC-School`
    });
  }
}, { immediate: true }); // Run immediately on component load

// --- Image Upload Logic (Re-enabled with Cloudinary) ---
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
    editableCourse.value.image = response.url; // Update the image URL in the editable form
    console.log('Image uploaded successfully:', response.url);
  } catch (err) {
    console.error('Error uploading image:', err);
    imageUploadError.value = err.data?.statusMessage || 'Unknown error occurred during upload.';
    editableCourse.value.image = ''; // Clear image if upload fails
  } finally {
    uploadingImage.value = false;
    event.target.value = ''; // Clear the file input to allow selecting the same file again
  }
}


// --- Modal Actions ---
function openEditModal() {
  isEditingLesson.value = false;
  // Deep copy the course data to editableCourse
  editableCourse.value = course.value ? JSON.parse(JSON.stringify(course.value)) : {
    _id: null, title: '', description: '', image: '', duration: '', level: '', lessons: []
  };
  imageUploadError.value = null; // Clear image upload errors
  showModal.value = true;
}

function openAddLessonModal() {
  isEditingLesson.value = true;
  editingLessonId.value = null; // Indicate adding new lesson
  editableLesson.value = {
    _id: null,
    title: '',
    duration: '',
    link: '',
    free: false
  };
  showModal.value = true;
}

function editLesson(lesson) {
    isEditingLesson.value = true;
    editingLessonId.value = lesson._id; // Correctly sets the lesson's _id
    editableLesson.value = JSON.parse(JSON.stringify(lesson)); 
    showModal.value = true;
}
function confirmDelete(type, id = null) {
    deleteType.value = type;
    itemToDelete.value = id || courseId; // For course, it's courseId; for lesson, it's lesson._id
    showDeleteModal.value = true;
}


async function saveChanges() {
  // ... (image upload check)

  try {
    if (isEditingLesson.value) {
      if (editingLessonId.value) {
        // Update existing lesson
        // Make sure the URL string uses backticks and correct interpolation
        await $fetch(`/api/courses/${courseId}/lessons`, { // Correct URL
          method: 'PUT',
          body: editableLesson.value,
        });
        alert('Lesson updated successfully!');
      } else {
        // Add new lesson
        // Make sure the URL string uses backticks and correct interpolation
        await $fetch(`/api/courses/${courseId}/lessons`, { // Correct URL
          method: 'POST',
          body: editableLesson.value,
        });
        alert('Lesson added successfully!');
      }
    } else {
      // Update course
      // Make sure the URL string uses backticks and correct interpolation
      await $fetch(`/api/courses/${courseId}`, { // Correct URL
        method: 'PUT',
        body: editableCourse.value,
      });
      alert('Course updated successfully!');
    }
    closeModal();
    refresh();
  } catch (e) {
    console.error('Error saving changes:', e);
    alert('Failed to save changes: ' + (e.data?.statusMessage || e.message));
  }
}

async function executeDelete() {
  try {
    if (deleteType.value === 'course') {
      // ... (delete course logic)
    } else if (deleteType.value === 'lesson') {
      // Send DELETE request to nested lesson API
      // Make sure the URL string uses backticks and correct interpolation
      await $fetch(`/api/courses/${courseId}/lessons`, { // Correct URL
        method: 'DELETE',
        body: { _id: itemToDelete.value }, // Pass the lesson ID in the body
      });
      alert('Lesson deleted successfully!');
      refresh();
    }
  } catch (e) {
    console.error(`Error deleting ${deleteType.value}:`, e);
    alert(`Failed to delete ${deleteType.value}: ` + (e.data?.statusMessage || e.message));
  } finally {
    showDeleteModal.value = false;
    itemToDelete.value = null;
  }
}

function closeModal() {
  showModal.value = false;
  isEditingLesson.value = false;
  editingLessonId.value = null;
  editableCourse.value = {
    _id: null, title: '', description: '', image: '', duration: '', level: '', lessons: []
  };
  editableLesson.value = {
    _id: null, title: '', duration: '', link:'', free: false
  };
  imageUploadError.value = null;
}
</script>

<style scoped>
/* Your existing CSS remains completely unchanged */
.course-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.breadcrumb {
  @apply text-sm mb-2 flex items-center;
  color: var(--text-secondary);
}

.course-header {
  @apply mb-8 mt-12;
}

.course-title {
  @apply text-3xl font-bold mb-4;
  color: var(--heading-color);
}
.course-meta {
  @apply flex gap-2 mb-6;
}

.badge {
  @apply px-3 py-1 rounded-full text-sm;
  background-color: var(--badge-bg);
  color: var(--badge-text);
}

.course-content {
  @apply grid md:grid-cols-3 gap-8;
}

.course-image-container {
  @apply md:col-span-1;
}

.course-image {
  @apply w-full rounded-lg shadow-md mb-4;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.course-description {
  @apply p-4 rounded-lg;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
}

.course-description h3 {
  @apply font-bold text-lg mb-2;
  color: var(--heading-color);
}

.lessons-section {
  @apply md:col-span-2;
}

.section-header h2 {
  @apply text-2xl font-bold mb-1;
  color: var(--heading-color);
}

.section-header p {
  color: var(--text-secondary);
}
.lessons-list {
  @apply space-y-2;
}

.lesson-card {
  @apply flex items-start p-4 rounded-lg transition-all;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
}
.lesson-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 1px 3px 0 var(--shadow-color);
}

.lesson-number {
  @apply flex items-center justify-center w-8 h-8 rounded-full mr-4 font-medium;
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.lesson-info {
  @apply flex-1;
}

.lesson-meta {
  @apply flex items-center gap-3 mt-1 text-sm;
  color: var(--text-secondary);
}
.free-badge {
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .course-content {
    @apply grid-cols-1;
  }
}

/* New admin control styles */
.admin-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 16px;
}

.edit-btn, .delete-btn, .add-lesson-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.edit-btn {
  background-color: #f0ad4e;
  color: white;
  border: none;
}

.delete-btn {
  background-color: #d9534f;
  color: white;
  border: none;
}

.add-lesson-btn {
  background-color: #5cb85c;
  color: white;
  border: none;
}

.lesson-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.edit-lesson-btn, .delete-lesson-btn {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
  cursor: pointer;
}

.edit-lesson-btn {
  color: #31708f;
  background-color: #d9edf7;
  border: 1px solid #bce8f1;
}

.delete-lesson-btn {
  color: #a94442;
  background-color: #f2dede;
  border: 1px solid #ebccd1;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  
}

.form-group {
  margin-bottom: 1rem;
}
.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  min-height: 100px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}

.save-btn, .confirm-delete {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-delete {
  background: #d9534f;
}
</style>
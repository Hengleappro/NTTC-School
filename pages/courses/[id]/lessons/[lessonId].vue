<template>
  <div class="lesson-container">
    <div v-if="pendingCourse" class="loading-state">
      Loading lesson...
    </div>
    <div v-else-if="courseError" class="error-state">
      Error loading lesson: {{ courseError.message }}
    </div>
    <div v-else-if="!courseData || !lesson" class="not-found">
      Lesson not found.
    </div>

    <div v-else>
      <div class="lesson-header">
        <div class="header-top-row">
          <NuxtLink :to="`/courses/${courseId}`" class="back-link">
            &larr; Back to Course
          </NuxtLink>
          <div class="admin-actions" v-if="isAdmin" >
            <button @click="openEditModal" class="edit-btn">
              <span class="icon">✏️</span> Edit Lesson
            </button>
            <button @click="confirmDelete" class="delete-btn">
              <span class="icon">🗑️</span> Delete Lesson
            </button>
          </div>
        </div>
        <div class="breadcrumbs">
          <NuxtLink to="/courses">All Courses</NuxtLink>
          <span class="separator">/</span>
          <NuxtLink :to="`/courses/${courseId}`">{{ courseData.title }}</NuxtLink>
          <span class="separator">/</span>
          <span class="current-lesson">{{ lesson.title }}</span>
        </div>
      </div>

      <main class="lesson-content">
        <header class="lesson-title-section">
          <h1>{{ lesson.title }}</h1>
          <div class="lesson-meta">
            <span class="duration">{{ lesson.duration || '45 minutes' }}</span>
            <span v-if="lesson.free" class="free-badge">Free Lesson</span>
          </div>
        </header>

        <div class="content-wrapper">
          <Pdf 
            v-if="lesson.link && (lesson.link.endsWith('.pdf') || lesson.link.includes('drive.google.com'))" 
            :pdf-url="lesson.link" 
          />
          
          <div v-else-if="lesson.content" class="text-content" v-html="formattedContent" />
          
          <img 
            v-if="lesson.image" 
            :src="lesson.image" 
            :alt="lesson.title" 
            class="lesson-image"
            loading="lazy"
          />
          
          <div v-if="lesson.videoUrl" class="video-container">
            <iframe 
              :src="lesson.videoUrl" 
              frameborder="0" 
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
            />
          </div>
          
          <div v-if="lesson.resources?.length" class="resources-section">
            <h3>Resources</h3>
            <ul>
              <li v-for="resource in lesson.resources" :key="resource.name">
                <a :href="resource.url" target="_blank" rel="noopener noreferrer">
                  <span class="icon">📄</span> {{ resource.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="lesson-navigation">
          <NuxtLink 
            v-if="previousLessonId"
            :to="`/courses/${courseId}/lessons/${previousLessonId}`"
            class="nav-button prev"
          >
            &larr; Previous Lesson
          </NuxtLink>
          <div v-else class="empty-nav-space"></div>
          <NuxtLink 
            v-if="nextLessonId"
            :to="`/courses/${courseId}/lessons/${nextLessonId}`"
            class="nav-button next"
          >
            Next Lesson &rarr;
          </NuxtLink>
        </div>
      </main>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Edit Lesson</h3>
        <form @submit.prevent="saveLesson">
          <div class="form-group">
            <label for="lessonTitle">Title</label>
            <input id="lessonTitle" v-model="editableLesson.title" required>
          </div>
          <div class="form-group">
            <label for="lessonDuration">Duration</label>
            <input id="lessonDuration" v-model="editableLesson.duration">
          </div>
          <div class="form-group">
            <label for="lessonContent">Content</label>
            <textarea id="lessonContent" v-model="editableLesson.content"></textarea>
          </div>
          <div class="form-group">
            <label for="lessonLink">PDF Link</label>
            <input id="lessonLink" v-model="editableLesson.link">
          </div>
          <div class="form-group">
            <label for="lessonImage">Image URL</label>
            <input id="lessonImage" v-model="editableLesson.image">
          </div>
          <div class="form-group">
            <label for="lessonVideo">Video URL</label>
            <input id="lessonVideo" v-model="editableLesson.videoUrl">
          </div>
          <div class="form-group checkbox-group">
            <input type="checkbox" v-model="editableLesson.free" id="free-lesson">
            <label for="free-lesson">Free Lesson</label>
          </div>
          <div class="form-group">
            <label for="lessonResources">Resources (JSON format)</label>
            <textarea id="lessonResources" v-model="resourcesJson"></textarea>
            <p class="help-text">e.g., `[{"name": "Doc 1", "url": "http://link.com"}]`</p>
          </div>
          <div class="modal-buttons">
            <button type="button" @click="closeModal" class="cancel-btn">Cancel</button>
            <button type="submit" class="save-btn">Save Changes</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Confirm Delete</h3>
        <p class="modal-text">Are you sure you want to delete this lesson? This action cannot be undone.</p>
        <div class="modal-buttons">
          <button @click="showDeleteModal = false" class="cancel-btn">Cancel</button>
          <button @click="deleteLesson" class="delete-confirm-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter, useAsyncData, useHead } from '#app';
// Make sure you have the Pdf component imported if it's in a separate file
// For example: import Pdf from '~/components/Pdf.vue'; // Adjust path as needed

const route = useRoute();
const router = useRouter();
const { isAdmin, isLoggedIn } = useAuth();
// isAdmin should be managed by a proper authentication system.
// For demonstration, it's set to true to display the admin buttons.
// You'll replace this with actual authentication logic (e.g., checking a user role).

const { id: courseId, lessonId } = route.params as { id: string, lessonId: string };

interface Resource {
  name: string;
  url: string;
}

interface Lesson {
  _id: string;
  title: string;
  duration?: string;
  content?: string;
  link?: string;
  image?: string;
  videoUrl?: string;
  resources?: Resource[];
  free?: boolean;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  lessons: Lesson[];
}

// State management
const showModal = ref(false);
const showDeleteModal = ref(false);
const editableLesson = ref<Partial<Lesson>>({});
const resourcesJson = ref('');

// Fetch course data
const { data: courseData, pending: pendingCourse, error: courseError, refresh: refreshCourse } = await useAsyncData<Course>(
  `course-lesson-${courseId}`,
  () => $fetch(`/api/courses/${courseId}`),
  {
    watch: [() => route.params.id],
    transform: (data) => {
      if (!data) {
        throw createError({ statusCode: 404, statusMessage: 'Course not found' });
      }
      return data;
    }
  }
);

// Computed properties
const lesson = computed<Lesson | undefined>(() => {
  return courseData.value?.lessons.find(l => l._id === lessonId);
});

const formattedContent = computed(() => lesson.value?.content?.replace(/\n/g, '<br>') || '');

const currentLessonIndex = computed(() => {
  if (!courseData.value || !lesson.value) return -1;
  return courseData.value.lessons.findIndex(l => l._id === lesson.value?._id);
});

const previousLessonId = computed<string | undefined>(() => {
  if (currentLessonIndex.value > 0 && courseData.value) {
    return courseData.value.lessons[currentLessonIndex.value - 1]?._id;
  }
  return undefined;
});

const nextLessonId = computed<string | undefined>(() => {
  if (currentLessonIndex.value !== -1 && currentLessonIndex.value < (courseData.value?.lessons.length || 0) - 1 && courseData.value) {
    return courseData.value.lessons[currentLessonIndex.value + 1]?._id;
  }
  return undefined;
});

// Page head
watch([courseData, lesson], ([newCourseData, newLesson]) => {
  if (newLesson && newCourseData) {
    useHead({
      title: `${newLesson.title} | ${newCourseData.title} | NTTC-School`
    });
  } else if (newCourseData) {
    useHead({
      title: `${newCourseData.title} | NTTC-School`
    });
  } else {
    useHead({
      title: `Lesson | NTTC-School`
    });
  }
}, { immediate: true });

// Modal actions
function openEditModal() {
  if (!lesson.value) return;
  editableLesson.value = JSON.parse(JSON.stringify(lesson.value));
  resourcesJson.value = JSON.stringify(lesson.value.resources || [], null, 2);
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editableLesson.value = {};
  resourcesJson.value = '';
}

// CRUD operations
async function saveLesson() {
  try {
    const updatedLessonData = {
      ...editableLesson.value,
      resources: resourcesJson.value ? JSON.parse(resourcesJson.value) : []
    };

    if (!updatedLessonData._id) {
      updatedLessonData._id = lessonId;
    }

    await $fetch(`/api/courses/${courseId}/lessons`, {
      method: 'PUT',
      body: updatedLessonData,
    });
    
    alert('Lesson updated successfully!');
    closeModal();
    await refreshCourse();
  } catch (error: any) {
    console.error('Error saving lesson:', error);
    alert('Failed to save lesson: ' + (error.data?.statusMessage || error.message));
  }
}

function confirmDelete() {
  showDeleteModal.value = true;
}

async function deleteLesson() {
  try {
    await $fetch(`/api/courses/${courseId}/lessons`, {
      method: 'DELETE',
      body: { lessonId: lesson.value?._id },
    });
    alert('Lesson deleted successfully!');
    showDeleteModal.value = false;
    router.push(`/courses/${courseId}`);
  } catch (error: any) {
    console.error('Error deleting lesson:', error);
    alert('Failed to delete lesson: ' + (error.data?.statusMessage || error.message));
  }
}
</script>

<style scoped>
/* Base Typography */
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

.lesson-container {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-regular);
  line-height: 1.6;
  color: #334155;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 50px;
  padding: 2rem;
  min-height: calc(100vh - 120px);
  background-color: #f8fafc;
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  color: #1e293b;
  margin-top: 0;
}

.lesson-title-section h1 {
  font-size: 2.25rem;
  line-height: 1.2;
  margin-bottom: 0.75rem;
}

/* Text Content */
.text-content {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: #334155;
}

.text-content :deep(p) {
  margin-bottom: 1.25rem;
}

.text-content :deep(h2) {
  font-size: 1.75rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.text-content :deep(h3) {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

/* Buttons and Links */
.back-link, .edit-btn, .delete-btn, 
.nav-button, .cancel-btn, .save-btn, 
.delete-confirm-btn {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.01em;
}

/* Modal Content */
.modal-title {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
  line-height: 1.3;
}

.modal-text {
  font-size: 1.0625rem;
  line-height: 1.6;
}

/* Form Elements */
.form-group label {
  font-weight: var(--font-weight-medium);
  font-size: 0.9375rem;
}

input, textarea {
  font-family: var(--font-primary);
  font-size: 1rem;
}

/* Responsive Typography */
@media (max-width: 768px) {
  .lesson-title-section h1 {
    font-size: 2rem;
  }
  
  .text-content {
    font-size: 1rem;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .lesson-title-section h1 {
    font-size: 1.75rem;
  }
  
  .text-content {
    font-size: 0.9375rem;
    line-height: 1.6;
  }
}

/* Rest of your existing styles remain the same... */
.loading-state,
.error-state,
.not-found {
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.125rem;
  font-weight: var(--font-weight-medium);
}

.error-state {
  color: #dc2626;
}

.not-found {
  color: #64748b;
}

.lesson-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-link:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.admin-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.edit-btn,
.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edit-btn {
  background-color: #f59e0b;
}

.edit-btn:hover {
  background-color: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.delete-btn {
  background-color: #ef4444;
}

.delete-btn:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.icon {
  margin-right: 0.25rem;
  font-size: 1.1em;
}

.breadcrumbs {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color: #64748b;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.breadcrumbs a {
  color: #3b82f6;
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.breadcrumbs .separator {
  color: #94a3b8;
}

.breadcrumbs .current-lesson {
  font-weight: var(--font-weight-semibold);
  color: #1e293b;
}

.lesson-content {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.lesson-title-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.lesson-meta {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  color: #64748b;
  font-size: 0.9375rem;
}

.duration {
  font-weight: var(--font-weight-medium);
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

.content-wrapper {
  margin-top: 1.5rem;
}

.lesson-image {
  max-width: 100%;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  max-height: 500px;
  object-fit: contain;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  margin: 1.5rem 0;
  border-radius: 0.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: black;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.resources-section {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.resources-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.resources-section ul {
  list-style: none;
  padding: 0;
}

.resources-section li {
  margin-bottom: 0.75rem;
}

.resources-section a {
  color: #3b82f6;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: var(--font-weight-medium);
  transition: color 0.2s ease;
}

.resources-section a:hover {
  color: #2563eb;
  text-decoration: underline;
}

.lesson-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  gap: 1rem;
}

.nav-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.nav-button:hover {
  background-color: #eff6ff;
  color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.nav-button.prev {
  margin-right: auto;
}

.nav-button.next {
  margin-left: auto;
}

.empty-nav-space {
  flex-grow: 1;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #334155;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.375rem;
  font-family: inherit;
  font-size: 1rem;
  color: #334155;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin: 0;
  transform: scale(1.1);
  accent-color: #3b82f6;
}

.checkbox-group label {
  margin-bottom: 0;
}

.help-text {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.cancel-btn,
.save-btn,
.delete-confirm-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: var(--font-weight-semibold);
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cancel-btn {
  background-color: #e2e8f0;
  color: #334155;
}

.cancel-btn:hover {
  background-color: #cbd5e1;
  transform: translateY(-1px);
}

.save-btn {
  background-color: #10b981;
  color: white;
}

.save-btn:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

.delete-confirm-btn {
  background-color: #ef4444;
  color: white;
}

.delete-confirm-btn:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .lesson-container {
    padding: 1rem;
  }

  .lesson-content {
    padding: 1.5rem;
  }
  
  .admin-actions {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .admin-actions button {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    width: 95%;
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .lesson-header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  .header-top-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .back-link {
    width: 100%;
    justify-content: center;
  }

  .breadcrumbs {
    flex-direction: column;
    align-items: flex-start;
    font-size: 0.8125rem;
    gap: 0.25rem;
  }

  .lesson-navigation {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>
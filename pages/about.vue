<template>
  <div class="about">
    <h1>អំពីមជ្ឈមណ្ឌល NTTC</h1>
    <p class="hi">សួស្ដីប្អូនៗនិស្សិតទាំងអស់ជាទីស្រឡាញ់</p>

    <div class="about-content">
      <p> &nbsp; &nbsp; &nbsp; &nbsp; មជ្ឈមណ្ឌល NTTC ជាមជ្ឈមណ្ឌលមួយដែល មានបណ្ដុះបណ្ដាលនូវមុខវិជ្ជា IT ដ៏សម្បូរបែបក្នុងនោះរួមមានវគ្គបណ្ដុះបណ្ដាលដូចជា៖</p>

      <div v-if="pendingCourses" class="text-center py-4 text-gray-600">
        <p>Loading course offerings...</p>
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto mt-2"></div>
      </div>
      <div v-else-if="courseError" class="text-center py-4 text-red-600">
        <p>Error loading course offerings: {{ courseError.message }}</p>
      </div>
      <div v-else-if="courses && courses.length > 0">
        <p v-for="(course, index) in courses" :key="course._id">
          {{ index + 1 }}. {{ course.title }}
        </p>
        <p>និងមុខវិជ្ជាផ្សេងៗទៀត​ <br></p>
      </div>
      <div v-else class="text-center py-4 text-gray-600">
        <p>No course offerings available yet.</p>
      </div>
      <p><br></p>
      <p> &nbsp; &nbsp; &nbsp; &nbsp; មជ្ឈមណ្ឌល NTTC គឺជាមជ្ឈមណ្ឌលមួយដែលចាប់ផ្ដើមដំណើរការតាំងពីឆ្នាំ 2017 ដែលទទួលបាននូវការគាំទ្រយ៉ាងពេញទំហឹងពីសំណាក់ប្អូនៗនិស្សិត។ ទំនាក់ទំនងទៅកាន់លេខទូរស័ព្ទ ឬ gmail នៅខាងក្រោមដើម្បីទទួលបានព័ត៌មានបន្ថែមទៀត</p>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData, useHead } from '#app'; // Ensure useAsyncData is imported

// Fetch courses data
const { data: courses, pending: pendingCourses, error: courseError } = await useAsyncData(
  'about-courses', // Unique key for this fetch operation
  () => $fetch('/api/courses') // Your API endpoint to fetch courses
);

useHead({
  title: 'About | NTTC-School'
});
</script>

<style scoped>
.about {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 50px;
}

.about h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.hi {
  text-align: center;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
}
.about-content {
  margin-top: 2rem;
  line-height: 1.6;
  font-size: 1.2rem;
}

.about-content p {
  margin-bottom: 1rem;
}

/* Spinner animation (if not already global) */
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
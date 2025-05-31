<template>
  <div class="font-medium text-center  mb-4">
    <h1>
      ✍️ this is a pdf file for learning purposes
    </h1>

    <h1>✍️ Just hold and scroll for view </h1>
  </div>
  <div class="pdf-container" v-if="pdfUrl">
    <iframe
      :src="processedPdfUrl"
      width="100%"
      height="600px"
      style="border:none;"
      allow="autoplay"
    ></iframe>
  </div>
  <div v-else>
    <p>No PDF URL provided.</p>
  </div>
  <h1 class="mt-4 ">If you have any Question please <NuxtLink to="/contact" class="hover:text-blue-700 hover:underline text-red-500">click me </NuxtLink> 👇👇</h1>
  
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';

const props = defineProps({
  pdfUrl: {
    type: String,
    required: false,
    default: ''
  }
});

const processedPdfUrl = computed(() => {
  if (!props.pdfUrl) return '';
  
  // Handle Google Drive URLs
  if (props.pdfUrl.includes('drive.google.com')) {
    const fileId = extractGoogleDriveFileId(props.pdfUrl);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }
  
  // Handle direct PDF URLs
  if (props.pdfUrl.endsWith('.pdf')) {
    return props.pdfUrl;
  }
  
  // Fallback to original URL
  return props.pdfUrl;
});

function extractGoogleDriveFileId(url: string): string | null {
  // Matches:
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/open?id=FILE_ID
  const patterns = [
    /\/file\/d\/([^\/]+)/,
    /id=([^&]+)/,
    /([-\w]{25,})/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}
</script>

<style scoped>
.pdf-container {
  width: 100%;
  height: 1200px; /* Fixed height for the container, iframe will fill it */
  min-height: 400px; /* Ensure a minimum visible area */
  position: relative; /* Needed for absolute positioning of iframe */
  background-color: #000000; /* Placeholder background */
  border-radius: 8px; /* Slightly rounded corners */
  overflow: hidden; /* Ensures iframe respects border-radius */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.pdf-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
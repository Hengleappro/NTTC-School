<template>
    <div class="inline-flex items-center space-x-3">
        <div>
            <button label="upload" icon="i-heroicons-cloud-arrow-up" @click="uploadInput.click()">Upload PDF</button>
            <input
                class="hidden"
                ref="uploadInput"
                type="file"
                accept="application/pdf"
                @change="uploadFile"
            />
        </div>

        <section class="section" v-if="result.url">
            <div class="preview">
                <a :href="result.url" target="_blank">View Uploaded PDF</a>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const uploadInput = ref<HTMLInputElement | null>(null)
const result = reactive({
    url: '',
    publicId: ''
});

withDefaults(defineProps<{
    maxFileSize?: number, // in MB
}>(), {
    maxFileSize: 10
});

const emit = defineEmits(['upload']);

/**
 * Upload the selected PDF file directly to Cloudinary
 */
async function uploadFile(e: Event) {
    // Reset last result
    result.url = ''
    result.publicId = ''

    // Get selected files
    const { files } = e.target as HTMLInputElement
    if (!files || !files.length) return

    const file = files[0]

    // Check file size
    // if (file.size > maxFileSize * 1024 * 1024) {
    //  alert(`File size exceeds ${maxFileSize}MB limit`)
    //  return
    // }

    try {
        // Create form data
        const formData = new FormData()
        formData.append('file', file)
        const uploadPreset = 'your_unsigned_upload_preset'; //  Replace with your upload preset name
        formData.append('upload_preset', uploadPreset)
        formData.append('resource_type', 'auto') // Cloudinary will detect it's a PDF

        // Upload to  server (which will then upload to Cloudinary)
        const response = await fetch('/api/assets/file', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
          const errorText = await response.text(); // Get error message
          throw new Error(`Upload failed: ${response.status} - ${errorText}`);
        }
        const data = await response.json()

        if (data.url) { // Changed from secure_url to url
            result.url = data.url
            result.publicId = data.public_id
            emit('upload', {
                url: data.url, // Changed from secure_url to url
                publicId: data.public_id,
                format: data.format,
                bytes: data.bytes
            })
        } else {
            throw new Error('Upload failed: No URL received from server')
        }
    } catch (error: any) {
        console.error('Upload error:', error)
        alert(`Failed to upload PDF: ${error.message}`) // show error message
    } finally {
        // Clear selected files of input element
        if (uploadInput.value) {
            uploadInput.value.value = ''
        }
    }
}
</script>

<style scoped>
.preview {
    margin-top: 1rem;
}
.preview a {
    color: blue;
    text-decoration: underline;
}
</style>

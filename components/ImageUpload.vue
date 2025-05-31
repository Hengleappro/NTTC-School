<template>
  <div class="inline-flex items-center space-x-3">
    <div>
      <button
        @click="uploadInput?.click()"
        class="upload-button"
      >
        Upload
      </button>
      <input
        class="hidden"
        ref="uploadInput"
        type="file"
        accept="image/jpg, image/jpeg, image/png, image/gif"
        @change="selectFile"
      />
    </div>

    <!-- Preview in popup/modal -->
    <Modal v-model="showConfirmationModal">
      <div class="confirmation-modal">
        <h3 class="mt-0 mb-3 font-bold text-gray-900">Confirm Upload</h3>
        <div class="preview-container">
          <img :src="previewUrl" alt="Selected image" class="preview-image" />
        </div>
        <div class="modal-footer">
          <button @click="cancelUpload" class="cancel-button">
            Cancel
          </button>
          <button @click="confirmUpload" class="confirm-button">
            Upload
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['upload'])
const uploadInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string>('')
const selectedFile = ref<File | null>(null)
const showConfirmationModal = ref<boolean>(false)

function selectFile(e: Event) {
  const target = e.target as HTMLInputElement
  const files = target.files
  
  if (!files || !files.length) return

  selectedFile.value = files[0]
  previewUrl.value = URL.createObjectURL(files[0])
  showConfirmationModal.value = true
  
  // Clear input to allow selecting same file again
  if (uploadInput.value) {
    uploadInput.value.value = ''
  }
}

async function confirmUpload() {
  if (!selectedFile.value) return

  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    const resultUpload = await $fetch('/api/assets/image', {
      method: 'POST',
      body: formData
    })
    
    emit('upload', resultUpload)
    resetUpload()
  } catch (error) {
    console.error('Upload failed:', error)
    // Add user feedback here if needed
  } finally {
    showConfirmationModal.value = false
  }
}

function cancelUpload() {
  resetUpload()
  showConfirmationModal.value = false
}

function resetUpload() {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
  }
  previewUrl.value = ''
  selectedFile.value = null
}
</script>

<style scoped>
.upload-button {
  background: linear-gradient(to left, #29692b, #15e40e);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s;
  
}

.upload-button:hover {
  background: linear-gradient(to right, #4b904d, #7CB342);
}

.confirmation-modal {
  padding: 20px;
  background: white;
  border-radius: 8px;
  max-width: 400px;
  width: 90vw;
}


.preview-container {
  margin: 16px 0;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #eee;
  border-radius: 4px;
  object-fit: contain;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}

.confirm-button {
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:hover {
  background-color: #45a049;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #d32f2f;
}
</style>
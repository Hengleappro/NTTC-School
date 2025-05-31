import { ref, watchEffect, onMounted } from 'vue'

export const useColorMode = () => {
  const colorMode = ref<'light' | 'dark'>('light')

  // Initialize on mount to ensure we're on the client
  onMounted(() => {
    const savedMode = localStorage.getItem('color-mode')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    colorMode.value = savedMode 
      ? savedMode as 'light' | 'dark'
      : systemPrefersDark ? 'dark' : 'light'
    
    // Apply initial class
    document.documentElement.classList.add(colorMode.value)
  })

  // Watch for changes
  watchEffect(() => {
    if (process.client) {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(colorMode.value)
      localStorage.setItem('color-mode', colorMode.value)
    }
  })

  const toggleColorMode = () => {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
  }

  return { colorMode, toggleColorMode }
}
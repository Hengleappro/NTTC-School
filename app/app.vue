<template>
  <div class="min-h-screen" :class="colorMode">
    <Navbar />
    <main class="bg-bg-color text-text-color transition-colors duration-300">
      <slot />
    </main>
  </div>
</template>

<script setup>
const { colorMode } = useColorMode()
</script>
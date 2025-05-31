<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero bg-gradient-to-r from-blue-400 to-blue-800 text-white py-40">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to NTTC-School</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Empowering your future with quality IT education</p>
        <div class="flex justify-center gap-4">
          <NuxtLink to="/courses" class="btn-primary">
            Explore Courses
          </NuxtLink>
          <NuxtLink to="/about" class="btn-secondary">
            Learn About Us
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Why Choose NTTC-School?</h2>
      <div class="feature-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-card">
          <div class="feature-icon">
            <img :src="feature.image" :alt="feature.title" class="feature-image">
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
          <p class="feature-meta">{{ feature.meta }}</p>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta bg-gradient-to-l from-gray-400 to-blue-800 py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Join hundreds of students advancing their careers with our courses</p>
        <NuxtLink to="/register" class="btn-primary-lg">
          Register Now
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({
  title: 'Home | NTTC-School - Quality IT Education',
  meta: [
    { name: 'description', content: 'NTTC-School offers professional IT courses in networking, system administration, and web development with certified instructors.' }
  ]
})

const features = [
  {
    title: 'Quality Education',
    image: '/images/certificate.jpg',
    description: 'Industry-recognized certifications',
    meta: 'Certification upon completion'
  },
  {
    title: 'Standard Curriculum',
    image: '/images/network.jpg',
    description: 'Up-to-date with industry standards',
    meta: 'Hands-on testing labs'
  },
  {
    title: 'Professional Teachers',
    image: '/images/sreymom.jpg',
    description: 'Learn from experienced instructors',
    meta: 'លោកសាស្រ្តាចារ្យ ម៉ម ស្រីមុំ'
  }
]
</script>

<style scoped>
.home {
  min-height: calc(100vh - 120px);
  
}

.hero {
  background-size: cover;
  background-position: center;
}

.container {
  max-width: 1200px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  @apply p-6 rounded-xl transition-all duration-300;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  @apply shadow-lg transform -translate-y-1;
  box-shadow: 0 10px 15px -3px var(--shadow-color);
}

.feature-icon {
  @apply mb-4 flex justify-center;
}

.feature-image {
  @apply w-full h-48 object-cover rounded-lg;
}

.feature-title {
  @apply text-xl font-bold mb-2;
  color: var(--heading-color);
}

.feature-desc {
  color: var(--text-color);
}

.feature-meta {
  color: var(--primary-color);
}

.btn-primary {
  @apply px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition hover:bg-blue-700;
}

.btn-primary-lg {
  @apply px-8 py-4 text-lg bg-blue-600 text-white font-medium rounded-lg transition hover:bg-blue-700;
}

.btn-secondary {
  @apply px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 transition hover:bg-blue-200;
}

@media (max-width: 640px) {
  .hero h1 {
    @apply text-3xl;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
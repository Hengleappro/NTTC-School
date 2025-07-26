<template>
  <div class="home">
    <section class="hero bg-gradient-to-r from-blue-400 to-blue-800 text-white py-32">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Welcome to NTTC-School</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Empowering your future with quality IT education</p>
        <div class="flex justify-center gap-4 flex-wrap">
          <NuxtLink to="/courses" class="btn-primary">
            Explore Courses
          </NuxtLink>
          <NuxtLink to="/about" class="btn-secondary">
            Learn About Us
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="py-16 container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Why Choose NTTC-School?</h2>
      <div class="feature-grid">
        <div v-for="(feature, index) in features" :key="index" class="feature-card">
          <div class="feature-icon">
            <img :src="feature.image" :alt="feature.altText" class="feature-image">
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.description }}</p>
          <p class="feature-meta">{{ feature.meta }}</p>
        </div>
      </div>
    </section>

    <section class="cta bg-gradient-to-l from-gray-400 to-blue-800 py-16 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">Join hundreds of students advancing their careers with our courses</p>
        <NuxtLink to="/register" class="btn-primary-lg">
          ចុះឈ្មោះឥលូវនេះ
        </NuxtLink>
      </div>
    </section>

    <section class="py-16 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      <div class="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold mb-6">Our Mission & Vision</h2>
          <p class="mb-4 leading-relaxed">
            At NTTC-School, our mission is to cultivate the next generation of IT professionals by providing cutting-edge education and hands-on training. We are committed to fostering a learning environment that encourages innovation, critical thinking, and practical skills development.
          </p>
          <p class="mb-4 leading-relaxed">
            Our vision is to be the leading IT education institution in the region, recognized for producing highly skilled, industry-ready graduates who contribute significantly to the technological advancement of society. We believe in empowering our students with the knowledge and tools they need to succeed in a rapidly evolving digital world.
          </p>
          <ul class="list-disc list-inside space-y-2">
            <li>Modern and well-equipped labs</li>
            <li>Experienced and dedicated instructors</li>
            <li>Strong industry connections for internships</li>
            <li>Focus on practical, real-world applications</li>
          </ul>
          <NuxtLink to="/about" class="btn-primary mt-8 inline-block">
            More About Our Story
          </NuxtLink>
        </div>
        <div>
          <img src="https://res.cloudinary.com/dfgegfg9c/image/upload/v1747680306/jnl0yuhywxgcdg14oipz.jpg" alt="NTTC School Campus Building" class="rounded-xl shadow-lg w-full h-auto object-cover max-h-96">
        </div>
      </div>
    </section>

    <section class="py-16 container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Popular Courses</h2>
      <p class="text-lg text-center mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
        Dive into our most sought-after IT programs designed to equip you with in-demand skills for today's tech landscape.
      </p>
      <div class="course-grid">
        <div v-for="(course, index) in popularCourses" :key="index" class="course-card">
          <img :src="course.image" :alt="course.imageAlt" class="course-image">
          <div class="p-6">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-desc">{{ course.description }}</p>
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
              </svg>
              <span>{{ course.rating }} ({{ course.students }} students)</span>
            </div>
            <NuxtLink :to="`/courses/${course.id}`" class="btn-primary-sm mt-4 inline-block">
              View Details
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="text-center mt-12">
        <NuxtLink to="/courses" class="btn-secondary-lg">
          View All Courses
        </NuxtLink>
      </div>
    </section>

    <section class="py-16 bg-blue-700 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-12">What Our Students Say</h2>
        <div class="testimonial-grid">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-card">
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="flex items-center justify-center mt-4">
              <img :src="testimonial.avatar" :alt="`Avatar of ${testimonial.name}`" class="testimonial-avatar">
              <div class="ml-4 text-left">
                <p class="font-bold">{{ testimonial.name }}</p>
                <p class="text-sm">{{ testimonial.course }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Our Student Success Stories</h2>
        <div class="success-story-grid">
          <div v-for="(story, index) in successStories" :key="index" class="success-story-card">
            <img :src="story.image" :alt="`Portrait of ${story.name}`" class="success-story-image">
            <div class="p-6">
              <h3 class="success-story-name">{{ story.name }}</h3>
              <p class="success-story-program">{{ story.program }}</p>
              <p class="success-story-text">{{ story.story }}</p>
              <span class="text-sm text-gray-500 dark:text-gray-400 mt-2 block">{{ story.year }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useHead } from '#app';

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
    altText: 'Graduation certificate with a golden seal',
    description: 'Industry-recognized certifications upon completion',
    meta: 'Boost your career with certified skills'
  },
  {
    title: 'Standard Curriculum',
    image: '/images/network.jpg',
    altText: 'Computer network diagram with glowing connections',
    description: 'Up-to-date with the latest industry standards and technologies',
    meta: 'Hands-on testing labs and practical projects'
  },
  {
    title: 'Professional Teachers',
    image: '/images/sreymom.jpg',
    altText: 'Portrait of Ms. Sreymom, a professional teacher',
    description: 'Learn from experienced and passionate instructors',
    meta: 'លោកសាស្រ្តាចារ្យ ម៉ម ស្រីមុំ and other industry experts'
  },
  {
    title: 'Advanced Laboratories', // Changed title
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753519719/xydistqizlh8qq6etk5l.jpg', // New image URL
    altText: 'Students working in a modern computer lab with multiple monitors and advanced equipment', // New alt text
    description: 'Cutting-edge labs equipped with the latest hardware and software for practical training.',
    meta: 'Hands-on experience in a real-world setting' // New meta
  },
  {
    title: 'Career Support',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753461381/xbr9odd8whjvbpboqkxr.jpg',
    altText: 'Two people shaking hands, symbolizing job placement',
    description: 'Guidance for job placement and career advancement',
    meta: 'Connect with our industry partners'
  },
  {
    title: 'Flexible Learning Options', // Changed title
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753519508/eoyvlv6zpey9ammpbt20.jpg', // New image URL
    altText: 'Student participating in an online class from home with a laptop', // New alt text
    description: 'Tailor your education with online, in-person, or hybrid learning models to fit your lifestyle.',
    meta: 'Study at your own pace, on your own schedule' // New meta
  }
];

const popularCourses = [
  {
    id: 'Basic-Computer',
    title: 'Basic Computer Network',
    image: 'http://res.cloudinary.com/dfgegfg9c/image/upload/v1747667132/h5xvnxa81duh6mr5b1lh.jpg',
    imageAlt: 'Computer network diagram with data flowing between devices',
    description: 'Master the basics of network security, firewalls, and intrusion detection.',
    rating: 4.8,
    students: 150
  },
  {
    id: 'web-development-pro',
    title: 'Windows Server Administration',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1747680305/t5iitmstez7kfa1xwttk.jpg',
    imageAlt: 'Windows Server interface on a monitor, symbolizing administration',
    description: 'Build dynamic web applications using modern frameworks like Vue.js and Node.js.',
    rating: 4.9,
    students: 220
  },
  {
    id: 'system-admin-linux',
    title: 'Linux System Administration',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1747680305/j0kcnr43bsm0dngftkr9.png',
    imageAlt: 'Linux penguin mascot on a server rack',
    description: 'Learn to manage, secure, and troubleshoot Linux servers.',
    rating: 4.7,
    students: 180
  },
  {
    id: 'data-science-intro',
    title: 'Cisco Networking',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1747697656/stxkgrtvsxd2iyh2cxw9.jpg',
    imageAlt: 'Cisco networking equipment with cables and connections',
    description: 'Explore data analysis, machine learning basics, and data visualization.',
    rating: 4.6,
    students: 120
  }
];

const testimonials = [
  {
    text: 'NTTC-School transformed my career! The hands-on labs and expert instructors made complex topics easy to understand. I secured a great job shortly after graduation.',
    name: 'LIM HENGLEAP',
    course: 'Full-Stack Web Development',
    avatar: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753507213/p6byi9qkspazlhk46kjo.jpg'
  },
  {
    text: 'The networking course was exceptional. The curriculum is truly industry-aligned, and I gained practical skills that were immediately applicable in my new role.',
    name: 'SOUN CHANVANNE',
    course: 'Network Security Fundamentals',
    avatar: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753507481/mb9wa7dsna2q1qxuvm7h.jpg'
  },
  {
    text: 'I highly recommend NTTC-School for anyone serious about an IT career. The support from teachers and staff is outstanding, creating a fantastic learning environment.',
    name: 'TEH ROFIKIN',
    course: 'Basic Computer and IT support',
    avatar: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753507549/iidrggxzd7vzmmrt6qnz.jpg'
  },
  {
    text: 'The Cisco Networking program was incredibly insightful. I now feel confident in network configuration and troubleshooting. A truly enriching experience!',
    name: 'SUM SENGENG',
    course: 'Cisco Networking',
    avatar: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753507506/nnrnsuqboouyrmobefej.jpg'
  }
];

const instructors = [
  {
    name: 'Mr. Morm Sreymom',
    title: 'Senior Network Engineer',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1747667132/cvzhkwuop4kw37mwqdnz.jpg',
    bio: 'With over 15 years of experience, Mr. Morm Sreymom specializes in cybersecurity and enterprise network solutions. He holds multiple industry certifications.'
  },
  {
    name: 'Ms. Alice Chen',
    title: 'Lead Web Developer',
    image: '/images/instructor-alice.jpg',
    bio: 'Ms. Chen is a full-stack expert with a passion for teaching modern web technologies. She has led development teams for various startups.'
  },
  {
    name: 'Mr. Kim Sareth',
    title: 'DevOps & Cloud Specialist',
    image: '/images/instructor-sareth.jpg',
    bio: 'Mr. Sareth brings extensive knowledge in cloud computing (AWS, Azure) and DevOps practices. He is known for his practical, hands-on approach.'
  },
  {
    name: 'Ms. Lena Pov',
    title: 'Data Science Lecturer',
    image: '/images/instructor-lena.jpg',
    bio: 'Ms. Pov is a data enthusiast with a strong background in data analysis and machine learning. She helps students unlock insights from complex datasets.'
  }
];

const successStories = [
  {
    name: 'តេះ រ៉ពីកីន',
    program: 'Working in Network Administration and IT Support',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753510274/hbdxcaflud2oozipxqmm.jpg',
    story: 'After completing the program, Te Rofikin landed a position as a Junior Network Administrator and IT Support specialist. "NTTC-School gave me the foundational knowledge and practical skills I needed."',
    year: 'Graduated 2024'
  },
  {
    name: 'លីម ហេងលៀប',
    program: 'Certificate in Web Development',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753510998/iim7nnbttuupatglhot0.jpg',
    story: 'Hengleap, a passionate self-learner, refined his skills at NTTC-School and is now a successful freelance web developer, building websites for businesses.',
    year: 'Graduated 2024'
  },
  {
    name: 'សុំ សេងអេង',
    program: 'IT Support and Maintenance Computer',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753514387/jioru1nuec1qt0pvmqds.png',
    story: 'Sengeng quickly moved up the ranks to an IT Support and Maintenance role, attributing his rapid growth to the in-depth training received.',
    year: 'Graduated 2024'
  },
  {
    name: 'សួន ចាន់វ៉ាន់ណេ',
    program: 'Network And Printer',
    image: 'https://res.cloudinary.com/dfgegfg9c/image/upload/v1753507481/mb9wa7dsna2q1qxuvm7h.jpg',
    story: 'Soun Chanvanne excelled in the Network and Printer course, gaining essential skills that propelled him into a key role managing enterprise network infrastructure.',
    year: 'Graduated 2025'
  }
];
</script>

<style scoped>
/* Base Styles - Keep existing */
.home {
  min-height: calc(100vh - 120px); /* Adjust based on your header/footer height */
}

.hero {
  background-size: cover;
  background-position: center;
}

.container {
  max-width: 1200px;
}

/* Existing Feature Grid Styles */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  @apply p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
}

.feature-card:hover {
  @apply shadow-lg transform -translate-y-1;
  box-shadow: 0 10px 15px -3px var(--shadow-color);
}

.feature-icon {
  @apply mb-4 flex justify-center w-full;
}

.feature-image {
  @apply w-full h-48 object-cover rounded-lg;
}

.feature-title {
  @apply text-xl font-bold mb-2;
  color: var(--heading-color);
}

.feature-desc {
  @apply text-gray-700 dark:text-gray-300 text-sm;
}

.feature-meta {
  @apply text-blue-600 dark:text-blue-400 text-sm mt-2;
}


/* New Styles for expanded sections */

/* Buttons */
.btn-primary {
  @apply px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition hover:bg-blue-700;
}

.btn-primary-lg {
  @apply px-8 py-4 text-lg bg-blue-600 text-white font-medium rounded-lg transition hover:bg-blue-700;
}

.btn-primary-sm {
  @apply px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-md transition hover:bg-blue-700;
}

.btn-secondary {
  @apply px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 transition hover:bg-blue-200 dark:bg-transparent dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900;
}

.btn-secondary-lg {
  @apply px-8 py-4 text-lg bg-white text-blue-600 font-medium rounded-lg border border-blue-600 transition hover:bg-blue-200 dark:bg-transparent dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900;
}


/* Course Grid */
.course-grid {
  @apply grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4; /* Adjusted for better layout on larger screens */
}

.course-card {
  @apply bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300;
  border: 1px solid var(--border-color);
}

.course-card:hover {
  @apply shadow-xl transform -translate-y-1;
}

.course-image {
  @apply w-full h-48 object-cover;
}

.course-title {
  @apply text-xl font-bold mb-2 text-gray-900 dark:text-white;
}

.course-desc {
  @apply text-gray-700 dark:text-gray-300 text-sm;
}

/* Testimonial Grid */
.testimonial-grid {
  @apply grid gap-8 md:grid-cols-2 lg:grid-cols-3;
}

.testimonial-card {
  @apply p-8 rounded-xl shadow-lg flex flex-col items-center text-center;
  /* Always use blue-800 for testimonials, overriding dark mode card background */
  background-color: #2b6cb0; /* Specific blue for testimonial cards */
  color: white; /* Ensure text is white against blue background */
}

.testimonial-text {
  @apply text-lg italic mb-6;
}

.testimonial-avatar {
  @apply w-16 h-16 rounded-full object-cover border-2 border-white;
}

/* Instructor Grid */
.instructor-grid {
  @apply grid gap-8 md:grid-cols-2 lg:grid-cols-4;
}

.instructor-card {
  @apply bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300;
  border: 1px solid var(--border-color);
}

.instructor-card:hover {
  @apply shadow-xl transform -translate-y-1;
}

.instructor-image {
  @apply w-full h-64 object-cover object-top; /* object-top to show faces better */
}

.instructor-name {
  @apply text-xl font-bold mb-1 text-gray-900 dark:text-white;
}

.instructor-title {
  @apply text-blue-600 dark:text-blue-400 text-base mb-2;
}

.instructor-bio {
  @apply text-gray-700 dark:text-gray-300 text-sm;
}

/* Success Story Grid */
.success-story-grid {
  @apply grid gap-8 md:grid-cols-2 lg:grid-cols-3;
}

.success-story-card {
  @apply bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden transition-all duration-300;
  border: 1px solid var(--border-color);
}

.success-story-card:hover {
  @apply shadow-xl transform -translate-y-1;
}

.success-story-image {
  @apply w-full h-72 object-cover;
}

.success-story-name {
  @apply text-xl font-bold mb-1 text-gray-900 dark:text-white;
}

.success-story-program {
  @apply text-blue-600 dark:text-blue-400 text-base mb-2;
}

.success-story-text {
  @apply text-gray-700 dark:text-gray-300 text-sm;
}

/* Dark Mode Variables (assuming you have a dark mode toggle somewhere) */
:root {
  --card-bg: #ffffff;
  --border-color: #e2e8f0;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --heading-color: #1a202c;
  --text-color: #4a5568;
  --primary-color: #2563eb; /* blue-600 */
}

html.dark {
  --card-bg: #2d3748;
  --border-color: #4a5568;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --heading-color: #edf2f7;
  --text-color: #a0aec0;
  --primary-color: #60a5fa; /* blue-400 */
}


/* Responsive adjustments */
@media (max-width: 640px) {
  .hero h1 {
    @apply text-3xl;
  }

  .feature-grid, .course-grid, .testimonial-grid, .instructor-grid, .success-story-grid {
    grid-template-columns: 1fr;
  }

  .btn-primary-lg, .btn-secondary-lg {
    @apply px-6 py-3 text-base;
  }
}
</style>
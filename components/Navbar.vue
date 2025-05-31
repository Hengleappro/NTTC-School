<template>
  <nav class="navbar">
    <div class="container">
      <NuxtLink to="/" class="font-bold text-3xl hover:text-blue-300 bg-gradient-to-r from-blue-400 to-blue-800 text-transparent bg-clip-text ">NTTC-School</NuxtLink>

      <button @click="toggleColorMode" class="color-mode-toggle desktop-visible">
        <template v-if="colorMode === 'light'">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-dasharray="4" stroke-dashoffset="4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"><animate id="lineMdMoonRisingTwotoneAltLoop0" fill="freeze" attributeName="stroke-dashoffset" begin="0.7s;lineMdMoonRisingTwotoneAltLoop0.begin+6s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop0.begin+2s;lineMdMoonRisingTwotoneAltLoop0.begin+4s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop0.begin+1.2s;lineMdMoonRisingTwotoneAltLoop0.begin+3.2s;lineMdMoonRisingTwotoneAltLoop0.begin+5.2s" dur="0.4s" values="0;4"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop0.begin+1.8s" to="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop0.begin+3.8s" to="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop0.begin+5.8s" to="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"/></path><path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"><animate id="lineMdMoonRisingTwotoneAltLoop1" fill="freeze" attributeName="stroke-dashoffset" begin="1.1s;lineMdMoonRisingTwotoneAltLoop1.begin+6s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop1.begin+2s;lineMdMoonRisingTwotoneAltLoop1.begin+4s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop1.begin+1.2s;lineMdMoonRisingTwotoneAltLoop1.begin+3.2s;lineMdMoonRisingTwotoneAltLoop1.begin+5.2s" dur="0.4s" values="0;4"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop1.begin+1.8s" to="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop1.begin+3.8s" to="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop1.begin+5.8s" to="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"/></path><path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"><animate id="lineMdMoonRisingTwotoneAltLoop2" fill="freeze" attributeName="stroke-dashoffset" begin="2s;lineMdMoonRisingTwotoneAltLoop2.begin+6s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop2.begin+2s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop2.begin+1.2s;lineMdMoonRisingTwotoneAltLoop2.begin+3.2s" dur="0.4s" values="0;4"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop2.begin+1.8s" to="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop2.begin+5.8s" to="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"/></path></g><path fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z" transform="translate(0 22)"><animateMotion fill="freeze" calcMode="linear" dur="0.6s" path="M0 0v-22"/></path></svg>
        </template>
        <template v-else>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="2" stroke-dashoffset="2" d="M12 19v1M19 12h1M12 5v-1M5 12h-1"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="2;0"/></path><path stroke-dasharray="2" stroke-dashoffset="2" d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"><animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0"/></path><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g><mask id="lineMdMoonFilledAltToSunnyFilledLoopTransition0"><circle cx="12" cy="12" r="12" fill="#fff"/><circle cx="18" cy="6" r="12" fill="#fff"><animate fill="freeze" attributeName="cx" dur="0.4s" values="18;22"/><animate fill="freeze" attributeName="cy" dur="0.4s" values="6;2"/><animate fill="freeze" attributeName="r" dur="0.4s" values="12;3"/></circle><circle cx="18" cy="6" r="10"><animate fill="freeze" attributeName="cx" dur="0.4s" values="18;22"/><animate fill="freeze" attributeName="cy" dur="0.4s" values="6;2"/><animate fill="freeze" attributeName="r" dur="0.4s" values="10;1"/></circle></mask><circle cx="12" cy="12" r="10" mask="url(#lineMdMoonFilledAltToSunnyFilledLoopTransition0)" fill="currentColor"><animate fill="freeze" attributeName="r" dur="0.4s" values="10;6"/></circle></svg>
        </template>
      </button>

      <button class="hamburger-menu" @click="toggleMobileMenu">
        <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"></path>
        </svg>
      </button>

      <div :class="['nav-links', { 'mobile-active': isMobileMenuOpen }]">
        <NuxtLink to="/" @click="closeMobileMenu">Home</NuxtLink>
        <NuxtLink to="/about" @click="closeMobileMenu">About</NuxtLink>
        <NuxtLink to="/courses" @click="closeMobileMenu">Courses</NuxtLink>
        <NuxtLink to="/contact" @click="closeMobileMenu">Contact</NuxtLink>
        <NuxtLink to="/user" v-if="auth.isAdmin.value" @click="closeMobileMenu">User</NuxtLink>
        
        <template v-if="auth.isLoggedIn.value">
          <NuxtLink to="/profile" class="bg-blue-500" @click="closeMobileMenu">{{ auth.user.value.name }}</NuxtLink>
          <NuxtLink @click="auth.clearUser" class="bg-red-500 hover:cursor-pointer">Logout</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="bg-blue-500" @click="closeMobileMenu">Login</NuxtLink>
          <NuxtLink to="/register" class="bg-blue-500" @click="closeMobileMenu">Sign up</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'; // Import ref for isMobileMenuOpen

const { colorMode, toggleColorMode } = useColorMode(); // Assuming useColorMode is defined elsewhere
const auth = useAuth(); // Assuming useAuth is defined elsewhere and provides isLoggedIn and user

const isMobileMenuOpen = ref(false); // Reactive state for mobile menu visibility

// Function to toggle the mobile menu state
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Function to close the mobile menu, useful when a link is clicked
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
/* Base Navbar Styles */
.navbar {
  background-color: var(--navbar-bg); /* Uses CSS variables for theming */
  color: var(--text-color);
  padding: 1rem 0;
  transition: background-color 0.3s ease;
  position: fixed; /* Fixed position at the top */
  top: 0;
  left: 0;
  right: 0;
  height: 75px; /* Fixed height for the navbar */
  z-index: 1000; /* Ensures navbar stays on top of other content */
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto; /* Centers the container */
  display: flex;
  justify-content: space-between; /* Spreads items to ends */
  align-items: center; /* Vertically aligns items */
}

/* Hamburger Menu Icon - Hidden by default on large screens */
.hamburger-menu {
  display: none; /* Hidden by default on desktop */
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 2rem; /* Size of the SVG icon */
  cursor: pointer;
  padding: 0.5rem;
  /* Adjust SVG size if needed */
  width: 2.5rem; /* Ensure clickable area */
  height: 2.5rem;
  margin-left: auto; /* Push it to the right for spacing */
}

/* Color Mode Toggle Button - Always visible, adjust positioning for mobile */
.color-mode-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-color);
  transition: transform 0.3s ease;
  margin-right: 1rem; /* Add some space to the right of the button */
}

.color-mode-toggle:hover {
  transform: scale(1.1);
}

/* Navigation Links - Desktop Styles */
.nav-links {
  display: flex; /* Horizontal layout for desktop */
  gap: 1rem; /* Space between links */
  align-items: center;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  white-space: nowrap; /* Prevent links from wrapping to new lines */
}

.nav-links a:hover {
  background-color: var(--hover-bg);
  color: rgb(172, 194, 219); /* Hover text color */
}

.nav-links a.router-link-active {
  background-color: var(--active-bg); /* Style for active link */
}

/* --- Mobile-Specific Styles (max-width: 768px) --- */
@media (max-width: 768px) {
  .container {
    width: 95%; /* Slightly more padding on mobile to avoid edge-to-edge content */
  }

  /* Hamburger Menu - Always visible on mobile */
  .hamburger-menu {
    display: block; /* Show the hamburger icon on mobile screens */
  }

  /* Color Mode Toggle - Adjust visibility only if necessary, but it's already outside nav-links */
  .color-mode-toggle {
    display: block; /* Ensure it's not hidden by other rules */
    margin-right: 0.5rem; /* Reduce margin for mobile */
    /* Remove padding if it's too much */
  }

  .nav-links {
    position: fixed; /* Position the menu overlay */
    top: 75px; /* Start below the fixed navbar */
    left: 0;
    width: 100%;
    height: calc(100vh - 75px); /* Take up remaining viewport height */
    flex-direction: column; /* Stack links vertically */
    background-color: var(--navbar-bg); /* Use navbar background for consistency */
    padding: 2rem 1rem; /* Add padding inside the menu */
    gap: 1.5rem; /* Space between stacked links */
    align-items: flex-start; /* Align links to the left edge of the menu */
    transform: translateX(100%); /* Initially position off-screen to the right */
    transition: transform 0.3s ease-in-out; /* Smooth slide-in/out animation */
    z-index: 999; /* Ensures menu is above main content but below navbar */
    overflow-y: auto; /* Allow scrolling if menu content is too long */
  }

  .nav-links.mobile-active {
    transform: translateX(0); /* Slide the menu into view when 'mobile-active' class is applied */
  }

  .nav-links a {
    width: 100%; /* Make links full width within the menu */
    padding: 1rem;
    text-align: left; /* Align text to the left */
    border-bottom: 1px solid rgba(255, 255, 255, 0.1); /* Add a subtle separator between links */
  }

  .nav-links a:last-child {
    border-bottom: none; /* Remove separator for the last item */
  }
}
</style>
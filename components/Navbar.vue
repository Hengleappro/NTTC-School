<template>
  <nav class="navbar">
    <div class="container">
      <NuxtLink to="/" class="font-bold text-3xl hover:text-blue-300 bg-gradient-to-r from-blue-400  to-blue-800 text-transparent bg-clip-text ">NTTC-School</NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/" >Home</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/courses">Courses</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
        <NuxtLink to="/user" v-if="auth.isAdmin.value">User</NuxtLink>
        <button @click="toggleColorMode" class="color-mode-toggle">
          <template v-if="colorMode === 'light'">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt --><g fill="none" stroke="currentColor" stroke-dasharray="4" stroke-dashoffset="4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"><animate id="lineMdMoonRisingTwotoneAltLoop0" fill="freeze" attributeName="stroke-dashoffset" begin="0.7s;lineMdMoonRisingTwotoneAltLoop0.begin+6s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop0.begin+2s;lineMdMoonRisingTwotoneAltLoop0.begin+4s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop0.begin+1.2s;lineMdMoonRisingTwotoneAltLoop0.begin+3.2s;lineMdMoonRisingTwotoneAltLoop0.begin+5.2s" dur="0.4s" values="0;4"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop0.begin+1.8s" to="M12 5h1.5M12 5h-1.5M12 5v1.5M12 5v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop0.begin+3.8s" to="M12 4h1.5M12 4h-1.5M12 4v1.5M12 4v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop0.begin+5.8s" to="M13 4h1.5M13 4h-1.5M13 4v1.5M13 4v-1.5"/></path><path d="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"><animate id="lineMdMoonRisingTwotoneAltLoop1" fill="freeze" attributeName="stroke-dashoffset" begin="1.1s;lineMdMoonRisingTwotoneAltLoop1.begin+6s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop1.begin+2s;lineMdMoonRisingTwotoneAltLoop1.begin+4s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop1.begin+1.2s;lineMdMoonRisingTwotoneAltLoop1.begin+3.2s;lineMdMoonRisingTwotoneAltLoop1.begin+5.2s" dur="0.4s" values="0;4"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop1.begin+1.8s" to="M17 11h1.5M17 11h-1.5M17 11v1.5M17 11v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop1.begin+3.8s" to="M18 12h1.5M18 12h-1.5M18 12v1.5M18 12v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop1.begin+5.8s" to="M19 11h1.5M19 11h-1.5M19 11v1.5M19 11v-1.5"/></path><path d="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"><animate id="lineMdMoonRisingTwotoneAltLoop2" fill="freeze" attributeName="stroke-dashoffset" begin="2s;lineMdMoonRisingTwotoneAltLoop2.begin+6s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop2.begin+2s" dur="0.4s" values="4;0"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="lineMdMoonRisingTwotoneAltLoop2.begin+1.2s;lineMdMoonRisingTwotoneAltLoop2.begin+3.2s" dur="0.4s" values="0;4"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop2.begin+1.8s" to="M20 5h1.5M20 5h-1.5M20 5v1.5M20 5v-1.5"/><set fill="freeze" attributeName="d" begin="lineMdMoonRisingTwotoneAltLoop2.begin+5.8s" to="M19 4h1.5M19 4h-1.5M19 4v1.5M19 4v-1.5"/></path></g><path fill="currentColor" fill-opacity=".3" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 6 C7 12.08 11.92 17 18 17 C18.53 17 19.05 16.96 19.56 16.89 C17.95 19.36 15.17 21 12 21 C7.03 21 3 16.97 3 12 C3 8.83 4.64 6.05 7.11 4.44 C7.04 4.95 7 5.47 7 6 Z" transform="translate(0 22)"><animateMotion fill="freeze" calcMode="linear" dur="0.6s" path="M0 0v-22"/></path></svg>
          </template>
          <template v-else>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt --><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="2" stroke-dashoffset="2" d="M12 19v1M19 12h1M12 5v-1M5 12h-1"><animate fill="freeze" attributeName="d" begin="0.6s" dur="0.2s" values="M12 19v1M19 12h1M12 5v-1M5 12h-1;M12 21v1M21 12h1M12 3v-1M3 12h-1"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="2;0"/></path><path stroke-dasharray="2" stroke-dashoffset="2" d="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5"><animate fill="freeze" attributeName="d" begin="0.8s" dur="0.2s" values="M17 17l0.5 0.5M17 7l0.5 -0.5M7 7l-0.5 -0.5M7 17l-0.5 0.5;M18.5 18.5l0.5 0.5M18.5 5.5l0.5 -0.5M5.5 5.5l-0.5 -0.5M5.5 18.5l-0.5 0.5"/><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.8s" dur="0.2s" values="2;0"/></path><animateTransform attributeName="transform" dur="30s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></g><mask id="lineMdMoonFilledAltToSunnyFilledLoopTransition0"><circle cx="12" cy="12" r="12" fill="#fff"/><circle cx="18" cy="6" r="12" fill="#fff"><animate fill="freeze" attributeName="cx" dur="0.4s" values="18;22"/><animate fill="freeze" attributeName="cy" dur="0.4s" values="6;2"/><animate fill="freeze" attributeName="r" dur="0.4s" values="12;3"/></circle><circle cx="18" cy="6" r="10"><animate fill="freeze" attributeName="cx" dur="0.4s" values="18;22"/><animate fill="freeze" attributeName="cy" dur="0.4s" values="6;2"/><animate fill="freeze" attributeName="r" dur="0.4s" values="10;1"/></circle></mask><circle cx="12" cy="12" r="10" mask="url(#lineMdMoonFilledAltToSunnyFilledLoopTransition0)" fill="currentColor"><animate fill="freeze" attributeName="r" dur="0.4s" values="10;6"/></circle></svg>
          </template>
        </button>
        <template v-if="auth.isLoggedIn.value">
          <NuxtLink to="/profile" class="bg-blue-500">{{ auth.user.value.name }}</NuxtLink>
          <NuxtLink @click="auth.clearUser" class="bg-red-500 hover:cursor-pointer">Logout</NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="bg-blue-500">Login</NuxtLink>
          <NuxtLink to="/register" class="bg-blue-500">Sign up</NuxtLink>
        </template>
      </div>
    </div>
  </nav>
</template>
<script setup>
const { colorMode, toggleColorMode } = useColorMode();
const auth = useAuth();
</script>

<style scoped>
.navbar {
  background-color: var(--navbar-bg);
  color: var(--text-color);
  padding: 1rem 0;
  transition: background-color 0.3s ease;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 75px;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}



.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-links a:hover {
  background-color: var(--hover-bg);
  color: rgb(172, 194, 219);
}

.nav-links a.router-link-active {
  background-color: var(--active-bg);
}

.color-mode-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  color: var(--text-color);
  transition: transform 0.3s ease;
}

.color-mode-toggle:hover {
  transform: scale(1.1);
}
</style>
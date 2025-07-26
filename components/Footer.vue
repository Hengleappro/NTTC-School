<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>NTTC-School</h3>
          <p>Study with NTTC-School</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About</NuxtLink>
          <NuxtLink to="/courses">Courses</NuxtLink>
          <NuxtLink to="/contact">Contact</NuxtLink>
        </div>
        <div class="footer-section">
          <h4>Contact Us</h4>
          <p>Email: {{ contact.email }}</p>
          <p>Phone: {{ contact.phone }}</p>
          <p>Telegram: {{ contact.phone }}</p>
          <p>Developer: <a :href="contact.telegram" target="_blank" rel="noopener noreferrer">Contact on Telegram</a></p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} NTTC-School. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const contact = {
  telegram: "https://t.me/hengleapzz",
  email: "mamsreymomit@gmail.com",
  phone: "+855 112 232 96",
};
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer {
  background-color: #2c3e50;
  color: white;
  padding: 2rem 0 0;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3, .footer-section h4 {
  margin-bottom: 1rem;
  color: #3498db;
}

.footer-section a {
  display: block;
  color: #ecf0f1;
  margin-bottom: 0.5rem;
  text-decoration: none;
}

.footer-section a:hover {
  color: #3498db;
}

.footer-bottom {
  border-top: 1px solid #34495e;
  padding-top: 1rem;
  text-align: center;
}
</style>
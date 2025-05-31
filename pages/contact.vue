<template>
  <div class="contact bg-bg-color text-text-color min-h-[calc(100vh-120px)] ">
    <h1 class="text-3xl font-bold text-center mb-8 text-heading-color mt-12">Contact Us</h1>
    
    <div class="contact-container">
      <div class="contact-info">
        <h2 class="text-2xl font-semibold mb-4 text-heading-color">Get in Touch</h2>
        <p class="mb-3"><strong>Email:</strong> mamsreymomit@gmail.com</p>
        <p class="mb-3"><strong>Phone:</strong> +855 112 232 96</p>
        <p class="mb-3"><strong>telegram:</strong> +855 112 232 96</p>
        <p class="mb-3"><strong>Address:</strong> ផ្ទះ7C ផ្លូវបេតុង, ភូមិម័ល ខណ្ឌដង្កោ សង្កាត់សង្កោ រាជធានីភ្នំពេញ</p>
        <p class="mb-3"><strong>Map:</strong> <a href="https://maps.app.goo.gl/iZtLdMctW7WCjAxBA" class="underline hover:text-blue-600 transition-colors">Click this</a></p>
      </div>
      
      <form class="contact-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name" class="text-text-color">Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="form.name" 
            required
            class="bg-card-bg border-border-color text-text-color"
          >
        </div>
        
        <div class="form-group">
          <label for="email" class="text-text-color">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
            class="bg-card-bg border-border-color text-text-color"
          >
        </div>
        
        <div class="form-group">
          <label for="message" class="text-text-color">Message</label>
          <textarea 
            id="message" 
            v-model="form.message" 
            required
            class="bg-card-bg border-border-color text-text-color"
          ></textarea>
        </div>
        
        <button type="submit" class="btn">Send Message</button>
      </form>
    </div>
  </div>
</template>

<script setup>
const form = reactive({
  name: '',
  email: '',
  message: ''
})

const submitForm = () => {
  // Here you would typically send the form data to a server
  alert('Message sent! Thank you for contacting us.')
  form.name = ''
  form.email = ''
  form.message = ''
}

useHead({
  title: 'Contact | NTTC-School'
})
</script>

<style scoped>
.contact {
  padding: 2rem 1rem;
  max-width: 1000px;
  margin: 0 auto;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.contact-info {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  transition: color 0.3s ease;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
}

.btn {
  padding: 0.8rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: var(--primary-hover);
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
  }
  
  .contact h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
}
</style>
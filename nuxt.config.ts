// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  // Keep your experimental features as they are, no changes needed for MongoDB here
  experimental: {
    scanPageMeta: 'after-resolve',
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    normalizeComponentNames: false,
    spaLoadingTemplateLocation: 'within',
    parseErrorData: false,
    pendingWhenIdle: true,
    defaults: {
      useAsyncData: {
        deep: true
      }
    }
  },

  features: {
    inlineStyles: true
  },

  unhead: {
    renderSSRHeadOptions: {
      omitLineBreaks: false
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
  ],

  // Configure Nitro plugins - this is where your MongoDB connection plugin lives
  nitro: {
    plugins: ['~/server/plugins/mongodb.ts']
  },

  // Runtime config for accessing environment variables on the server (and some public on client)
  runtimeConfig: {
    // Private keys (only available on server-side)
    mongodbUri: process.env.MONGODB_URI,
    mongodbDbName: process.env.MONGODB_DB_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

    // Public keys (available on both server and client side, prefixed with public)
    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_URL, // Your Cloudinary cloud name (e.g., dfgegfg9c)
      cloudinaryPreset: process.env.CLOUDINARY_PRESET,
      cloudinaryUploadUrl: process.env.CLOUDINARY_UPLOAD_URL,
      cloudinaryImageUrl: process.env.CLOUDINARY_IMAGE_URL,
    }
  },
});
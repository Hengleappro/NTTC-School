// server/utils/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { useRuntimeConfig } from '#imports';

const config = useRuntimeConfig();
cloudinary.config({
  cloud_name: config.public.cloudinaryCloudName, // Directly use the cloud name
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
  secure: true
});

export { cloudinary };
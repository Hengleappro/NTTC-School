// server/api/upload/index.ts
import { readMultipartFormData } from 'h3';
// import { cloudinary } from '../../utils/cloudinary'; // Adjust path if needed

// TODO: Update the import path below to the correct location of your cloudinary utility
// Example: import { cloudinary } from '~/server/utils/cloudinary';
// import { cloudinary } from '../utils/cloudinary';
// import { cloudinary } from '../../../utils/cloudinary';

export default defineEventHandler(async (event) => {
  const method = event.method;

  if (method === 'POST') {
    // ... (rest of your upload logic) ...
  } else {
    setResponseStatus(event, 405, 'Method Not Allowed');
    return { message: 'Method Not Allowed' };
  }
});
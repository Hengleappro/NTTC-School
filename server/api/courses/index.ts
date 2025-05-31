// server/api/courses/index.ts
// Ensure the import path is correct relative to server/api/courses/index.ts
// If Course.ts is in server/models, the path should be:
import Course, { ICourse } from '../../models/Course'; // This path is crucial

export default defineEventHandler(async (event) => {
  const method = event.method;
  console.log(`[API] Received ${method} request for /api/courses`);

  switch (method) {
    case 'GET':
      try {
        console.log('[API] Attempting to fetch courses from DB...');
        // The error happens here if 'Course' is not defined
        const courses: ICourse[] = await Course.find(); 
        console.log(`[API] Fetched ${courses.length} courses.`);
        return courses;
      } catch (e: any) {
        console.error('[API] Error fetching courses:', e);
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to fetch courses',
          data: e.message,
        });
      }
    case 'POST':
      try {
        const body = await readBody(event);
        console.log('[API] Attempting to create new course:', body.title);
        // Ensure required fields are present
        if (!body.title || !body.image || !body.description) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields: title, image, description',
          });
        }
        const newCourse: ICourse = await Course.create(body);
        console.log('[API] Course created:', newCourse._id);
        return newCourse;
      } catch (e: any) {
        console.error('[API] Error creating course:', e);
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to create course',
          data: e.message,
        });
      }
    default:
      setResponseStatus(event, 405, 'Method Not Allowed');
      return { message: 'Method Not Allowed' };
  }
});
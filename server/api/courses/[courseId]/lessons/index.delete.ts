import { defineEventHandler, readBody, getRouterParam, setResponseStatus } from 'h3';
import CourseModel from '~/server/models/Course';

export default defineEventHandler(async (event) => {
    const courseId = getRouterParam(event, 'courseId');
    if (!courseId) {
        setResponseStatus(event, 400, 'Course ID and Lesson ID are required');
        return { message: 'Course ID and Lesson ID are required' };
    }

    try {
            const course = await CourseModel.findById(courseId);
            if (!course) {
                setResponseStatus(event, 404, 'Course not found');
                return { message: 'Course not found' };
            }
            const body = await readBody(event);
            const lessonId = body._id;
            course.lessons.pull({ _id: lessonId });
            await course.save(); // Crucial: Save the parent document

            setResponseStatus(event, 204); // No Content
            return { message: 'Lesson deleted successfully' };
        } catch (error: any) {
            console.error('Error deleting lesson:', error);
            setResponseStatus(event, 500, 'Failed to delete lesson');
            return { message: 'Failed to delete lesson', error: error.message };
        }
});
import { defineEventHandler, readBody, getRouterParam, setResponseStatus } from 'h3';
import CourseModel from '~/server/models/Course';

export default defineEventHandler(async (event) => {
    const courseId = getRouterParam(event, 'courseId');
    if (!courseId) {
        setResponseStatus(event, 400, 'Course ID and Lesson ID are required');
        return { message: 'Course ID and Lesson ID are required' };
    }

    try {
            const body = await readBody(event);

            const course = await CourseModel.findById(courseId);
            if (!course) {
                setResponseStatus(event, 404, 'Course not found');
                return { message: 'Course not found' };
            }
            const lessonId = body._id;
            const lesson = course.lessons.id(lessonId);
            if (!lesson) {
                setResponseStatus(event, 404, 'Lesson not found');
                return { message: 'Lesson not found' };
            }

            Object.assign(lesson, body);
            await course.save(); // Crucial: Save the parent document

            setResponseStatus(event, 200);
            return lesson;
        } catch (error: any) {
            console.error('Error updating lesson:', error);
            setResponseStatus(event, 500, 'Failed to update lesson');
            return { message: 'Failed to update lesson', error: error.message };
        }
});
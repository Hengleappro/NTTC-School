// server/api/courses/[id].ts
import { defineEventHandler, readBody, getRouterParam, setResponseStatus } from 'h3';
import CourseModel from '~/server/models/Course'; // Adjust path if needed

export default defineEventHandler(async (event) => {
    const courseId = getRouterParam(event, 'id');

    if (!courseId) {
        setResponseStatus(event, 400, 'Course ID is required');
        return { message: 'Course ID is required' };
    }

    const method = event.method;

    if (method === 'GET') {
        try {
            const course = await CourseModel.findById(courseId);
            if (!course) {
                setResponseStatus(event, 404, 'Course not found');
                return { message: 'Course not found' };
            }
            return course;
        } catch (error: any) {
            console.error('Error fetching course:', error);
            setResponseStatus(event, 500, 'Internal Server Error');
            return { message: 'Failed to fetch course', error: error.message };
        }
    } else if (method === 'PUT') {
        try {
            const body = await readBody(event);
            const updatedCourse = await CourseModel.findByIdAndUpdate(
                courseId,
                body,
                { new: true, runValidators: true } // Return the updated document, run Mongoose validators
            );

            if (!updatedCourse) {
                setResponseStatus(event, 404, 'Course not found for update');
                return { message: 'Course not found' };
            }
            return updatedCourse;
        } catch (error: any) {
            console.error('Error updating course:', error);
            setResponseStatus(event, 500, 'Failed to update course');
            return { message: 'Failed to update course', error: error.message };
        }
    } else if (method === 'DELETE') {
        try {
            const deletedCourse = await CourseModel.findByIdAndDelete(courseId);
            if (!deletedCourse) {
                setResponseStatus(event, 404, 'Course not found for deletion');
                return { message: 'Course not found' };
            }
            setResponseStatus(event, 204); // No Content
            return { message: 'Course deleted successfully' };
        } catch (error: any) {
            console.error('Error deleting course:', error);
            setResponseStatus(event, 500, 'Failed to delete course');
            return { message: 'Failed to delete course', error: error.message };
        }
    } else {
        setResponseStatus(event, 405, 'Method Not Allowed');
        return { message: 'Method Not Allowed' };
    }
});
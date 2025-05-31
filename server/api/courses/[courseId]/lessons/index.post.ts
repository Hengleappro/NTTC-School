// server/api/courses/[courseId]/lessons/index.post.ts
import { defineEventHandler, readBody, getRouterParam, setResponseStatus } from 'h3';
import CourseModel from '~/server/models/Course'; // Adjust path if needed
import { Types } from 'mongoose'; // Import Types for ObjectId

export default defineEventHandler(async (event) => {
    const courseId = getRouterParam(event, 'courseId');

    if (!courseId) {
        setResponseStatus(event, 400, 'Course ID is required');
        return { message: 'Course ID is required' };
    }

    try {
            const body = await readBody(event);
            
            const course = await CourseModel.findById(courseId);
            if (!course) {
                setResponseStatus(event, 404, 'Course not found');
                return { message: 'Course not found' };
            }

            const newLessonId = new Types.ObjectId().toString(); // Generate new ID
            const newLesson = {
                _id: newLessonId,
                title: body.title,
                duration: body.duration,
                content: body.content,
                link: body.link,
                image: body.image,
                videoUrl: body.videoUrl,
                resources: body.resources || [],
                free: body.free || false,
            };
            course.lessons.push(newLesson);
            await course.save();

            setResponseStatus(event, 201, 'Lesson created successfully');
            return newLesson;
        } catch (error: any) {
            console.error('Error adding lesson:', error);
            setResponseStatus(event, 500, 'Failed to add lesson');
            return { message: 'Failed to add lesson', error: error.message };
        }
});
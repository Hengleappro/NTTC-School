import { readMultipartFormData, defineEventHandler, H3Event } from 'h3';
import { Readable } from 'stream';

// Helper function to convert a Buffer to a Readable stream
function bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null); // Indicates the end of the stream
    return stream;
}

export default defineEventHandler(async (event: H3Event) => {
    const preset = process.env.CLOUDINARY_PRESET || '';
    const apiKey = process.env.CLOUDINARY_API_KEY || '';
    const cloudName = process.env.CLOUDINARY_URL || '';
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;

    const body = await readMultipartFormData(event);
    if (!body || body.length === 0) {
        throw new Error('No file was uploaded.');
    }

    const file = body[0];

    if (!file) {
        throw createError({
            statusCode: 400,
            statusMessage: 'File is missing in the request.'
        });
    }
    const fileBuffer: Buffer = file.data;
    //const fileStream = bufferToStream(fileBuffer); // Remove this line

    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer], { type: file.type }), file.filename); // Create a Blob here
    formData.append('upload_preset', preset);
    formData.append('api_key', apiKey);
    formData.append('resource_type', 'raw'); // Add this line to force 'raw'

    try {
        const uploadData: any = await $fetch(uploadUrl, {
            method: 'post',
            body: formData,
        });

        return {
            resourceType: uploadData?.resource_type,
            url: uploadData?.secure_url || '',
        };
    } catch (error: any) {
        console.error("Cloudinary Upload Error:", error);
        throw createError({
            statusCode: 500,
            statusMessage: `Failed to upload to Cloudinary: ${error.message || 'Unknown error'}`,
            data: error
        });
    }
});

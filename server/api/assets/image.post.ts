export default defineEventHandler(async (event) => {
    const preset = process.env.CLOUDINARY_PRESET || '';
    const api_key = process.env.CLOUDINARY_API_KEY || '';
    const uploadUrl = (process.env.CLOUDINARY_UPLOAD_URL || '').replace(':resource_type', 'image');
    const body: any = await readMultipartFormData(event);
    const file = body[0];
    const formData = new FormData();
    const blob = new Blob([file.data], { type: file.type });
    formData.append('file', blob, file.filename);
    formData.append('upload_preset', preset);
    formData.append('api_key', api_key);
    const uploadData: any = await $fetch(uploadUrl, {
        method: 'post',
        body: formData
    });
    return {
        resourceType: uploadData?.resource_type,
        url: (uploadData?.url || '').replace(process.env.CLOUDINARY_IMAGE_URL, '')
    }
})

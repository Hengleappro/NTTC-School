import { defineEventHandler } from 'h3';
const IMAGE_CACHE_MAX_AGE = 604800;
export default defineEventHandler( async (event) => {
    //@ts-ignore
    const { res } = event.node;
    const slug = event.context.params?._;
    
    if (!slug) {
        res.statusCode = 400;
        res.end('Bad Request');
        return;
    }
    const assetPath = process.env.CLOUDINARY_IMAGE_URL + slug;
    
    try {
        const response = await fetch(assetPath);
        const data = await response.arrayBuffer();
        
        if (response.ok) {
        setResponseHeaders(res, IMAGE_CACHE_MAX_AGE);
          res.write(Buffer.from(data));
          res.end();
          return data;
        } else {
          setErrorResponse(res, response);
        }
      } catch (error) {
        console.error(error);
        setErrorResponse(res, error);
      }
    // return $fetch(assetPath);
});

function setResponseHeaders(res: any, cacheMaxAge: number) {
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', `public, max-age=${cacheMaxAge}`);
    res.setHeader('Cf-Cache-Status', 'MISS');
  }
  
  function setErrorResponse(res: any, error: any) {
    res.statusCode = error.status || 500;
    res.end(error.statusText || 'Internal Server Error');
  }

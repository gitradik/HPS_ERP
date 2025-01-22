const apiHost = import.meta.env.VITE_API_HOST;
const uploadsImagesProfilePath = import.meta.env.VITE_API_UPLOADS_IMAGES_PROFILE;

export const getUploadsImagesProfilePath = () => `${apiHost}${uploadsImagesProfilePath}`;
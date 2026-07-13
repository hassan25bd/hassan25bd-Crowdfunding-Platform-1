export const uploadToImgBB = async (file) => {
  const key = import.meta.env.VITE_IMGBB_API_KEY;
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || 'Image upload failed');
  }
  return result.data.url;
};

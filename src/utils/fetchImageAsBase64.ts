export const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
  try {
    console.log(imageUrl);
    const response = await fetch(
      `/api/fetch-image?url=${encodeURIComponent(imageUrl)}`,
    );
    if (!response.ok) {
      throw new Error(`Error fetching image: ${response.statusText}`);
    }
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to fetch image as base64:', error);
    throw error;
  }
};

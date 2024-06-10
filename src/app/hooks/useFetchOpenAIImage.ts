import { useState } from 'react';
import { fetchFromChatGPTAPI } from '@/openaiHandler/imageGeneration';
import { fetchImageAsBase64 } from '@/utils/fetchImageAsBase64'; // Ensure the correct path

export type ImageSizes = '1024x1024' | '1792x1024' | '1024x1792';

export const useFetchImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string>('');

  const fetchImage = async (prompt: string, sizing: ImageSizes) => {
    setIsLoading(true);
    try {
      const response = await fetchFromChatGPTAPI(prompt, sizing);
      const imageUrl = response.data[0].url; // Assuming the mock response structure
      const base64Image = await fetchImageAsBase64(imageUrl);
      setImage(base64Image);
    } catch (error) {
      console.error('Error fetching image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { image, isLoading, fetchImage };
};

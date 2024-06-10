import { useState } from 'react';
import { fetchFromChatGPTAPI } from '../../api/imageGeneration';

export const useFetchImage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string>('');

  const fetchImage = async (prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetchFromChatGPTAPI(prompt);
      setImage(response.data[0].url); // Assuming the mock response structure
    } catch (error) {
      console.error('Error fetching image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { image, isLoading, fetchImage };
};

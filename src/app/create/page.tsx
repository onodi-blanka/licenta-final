'use client';
import React, { useState, useEffect } from 'react';
import MyImg from '../../components/MyImg';
import { useFetchImage } from '../hooks/useFetchOpenAIImage';
import { usePicturesByUser } from '../hooks/firebase/usePictures';
import { auth, storage } from '../../firebase/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

const fetchImageAsBase64 = async (imageUrl: string): Promise<string> => {
  const response = await fetch(
    `http://localhost:3000/fetch-image?url=${encodeURIComponent(imageUrl)}`,
  );
  const data = await response.json();
  return `data:image/png;base64,${data.base64Image}`;
};

export default function CreateWallpaper() {
  const [prompt, setPrompt] = useState('');
  const { image, isLoading, fetchImage } = useFetchImage();
  const [currentUser, setCurrentUser] = useState(null);
  const { addPicture, loading, error } = usePicturesByUser(
    currentUser?.uid || '',
  );
  const router = useRouter();
  console.log(currentUser);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerateImage = async () => {
    await fetchImage(prompt);
  };

  const handleSaveToFirebase = async () => {
    if (image && currentUser) {
      try {
        const base64Image = await fetchImageAsBase64(image);
        const imageName = `wallpapers/${Date.now()}.png`;
        const imageRef = ref(storage, imageName);

        await uploadString(imageRef, base64Image, 'data_url', {
          contentType: 'image/png',
        });
        const imageUrl = await getDownloadURL(imageRef);

        await addPicture({
          imageUrl,
          prompt,
          createdBy: currentUser.uid,
          createdAt: new Date(),
        });

        console.log('Image saved to Firebase');
      } catch (error) {
        console.error('Error saving image to Firebase:', error);
      }
    }
  };

  const handleGoBackToMain = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center gap-8 bg-gray-100 pt-8 h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h1 className="uppercase font-bold text-center text-2xl mb-4">
          Create Wallpaper
        </h1>
        <textarea
          className="w-full h-48 p-2 border border-gray-300 rounded mb-4"
          placeholder="Write the wallpaper details you want to generate"
          value={prompt}
          onChange={handlePromptChange}></textarea>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt}
            className={`w-full py-2 font-bold rounded transition-colors duration-300 ${
              isLoading || !prompt
                ? 'bg-gray-200 text-black cursor-not-allowed'
                : 'bg-green-800 text-white hover:bg-green-900'
            } ${isLoading && 'animate-bounce'}`}>
            {isLoading ? 'Generating...' : 'Create'}
          </button>

          {image && (
            <button
              onClick={handleSaveToFirebase}
              disabled={loading}
              className="w-full py-2 font-bold rounded transition-colors duration-300 bg-blue-800 text-white hover:bg-blue-900">
              {loading ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleGoBackToMain}
            className="text-blue-800 hover:underline">
            Back to Main
          </button>
        </div>
      </div>
      {image && (
        <div className="self-center flex w-full max-w-lg">
          <MyImg src={image} />
        </div>
      )}
    </div>
  );
}

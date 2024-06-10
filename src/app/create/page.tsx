'use client';
import React, { useState, useEffect } from 'react';
import MyImg from '../../components/MyImg';
import { ImageSizes, useFetchImage } from '../hooks/useFetchOpenAIImage';
import { usePicturesByUser } from '../hooks/firebase/usePictures';
import { auth, db, storage } from '@/firebase/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { LuRectangleHorizontal } from 'react-icons/lu';
import { LuRectangleVertical } from 'react-icons/lu';
import { LuSquare } from 'react-icons/lu';

export default function CreateWallpaper() {
  const [prompt, setPrompt] = useState<string>('');
  const [sizing, setSizing] = useState<ImageSizes>('1024x1024');
  const { image, isLoading, fetchImage } = useFetchImage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { addPicture, loading, error } = usePicturesByUser(
    currentUser?.uid || '',
  );
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleGenerateImage = async () => {
    try {
      await fetchImage(prompt, sizing);
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  const handleSaveToFirebase = async () => {
    if (image && currentUser) {
      try {
        console.log(currentUser);
        const imageName = `wallpapers/${Date.now()}.png`;
        const imageRef = ref(storage, imageName);
        await uploadString(imageRef, image, 'data_url');
        const imageUrl = await getDownloadURL(imageRef);

        await addDoc(collection(db, 'pictures'), {
          imageUrl,
          prompt,
          createdBy: {
            userId: currentUser.uid,
            userEmail: currentUser.email,
          },
          createdAt: new Date(),
          likesCount: 0,
          groups: [],
        });

        console.log('Image saved to Firebase:', imageUrl);
        router.push('/');
      } catch (error: any) {
        if (error.code === 'permission-denied') {
          // Specific error message for permission issues
          console.error(
            'Error saving image to Firebase (permission denied):',
            error,
          );
          // You can display this error to the user or log it for debugging
        } else {
          console.error('Error saving image to Firebase:', error);
        }
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
          <div className="flex flex-row gap-6 self-center">
            <LuSquare
              onClick={() => setSizing('1024x1024')}
              className={`text-3xl ${sizing === '1024x1024' && 'text-green-500 bg-gray-300'} hover:bg-gray-200 cursor-pointer p-1`}
            />
            <LuRectangleHorizontal
              onClick={() => setSizing('1792x1024')}
              className={`text-3xl ${sizing === '1792x1024' && 'text-green-500 bg-gray-300'} hover:bg-gray-200 cursor-pointer p-1`}
            />
            <LuRectangleVertical
              onClick={() => setSizing('1024x1792')}
              className={`text-3xl ${sizing === '1024x1792' && 'text-green-500 bg-gray-300'} hover:bg-gray-200 cursor-pointer p-1`}
            />
          </div>
          <button
            onClick={handleGenerateImage}
            disabled={isLoading || !prompt || !currentUser}
            className={`w-full py-2 font-bold rounded transition-colors duration-300 ${
              isLoading || !prompt || !currentUser
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

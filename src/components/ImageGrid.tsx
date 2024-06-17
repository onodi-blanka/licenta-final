import React, { useState, useEffect } from 'react';
import { MdExpandMore } from 'react-icons/md';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Image from 'next/image';
import { LiaSaveSolid } from 'react-icons/lia';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useAuth } from '@/authContext';
import { useUserImageGroups } from '@/app/hooks/firebase/useUserImageGroups';
import { Picture } from '@/types/enitites';

const ImageGrid: React.FC<{ pictures: any[] }> = ({ pictures }) => {
  const { currentUser, userLoggedIn } = useAuth();
  const { imageGroups, loading, error } = useUserImageGroups(
    currentUser?.uid || '',
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGroups, setShowGroups] = useState<boolean>(false);
  const [imageToSave, setImageToSave] = useState<Picture | null>(null);
  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const showUserImageGroups = () => {
    if (currentUser) {
      setShowGroups(!showGroups);
      console.log('User Image Groups:', imageGroups);
    } else {
      alert('You need to be logged in to view your image groups');
    }
  };

  const saveImgToSelectedImgGroup = (picture: Picture) => {
    setImageToSave(picture);
  };

  if (!pictures || pictures.length === 0) {
    return <p>No pictures found</p>;
  }

  return (
    <div className="p-4">
      {/* ... your loading and error handling ... */}

      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="20px">
          {pictures.map((picture) => (
            <div
              key={picture.id}
              className="relative group"
              onClick={() => openImage(picture.imageUrl)}>
              <Image
                src={picture.imageUrl}
                width={0}
                height={0}
                sizes={'100vw'}
                alt={picture.prompt || 'Generated Image'}
                className="w-full h-auto rounded mb-2"
              />

              {/* Hover Details */}
              <div className="absolute bottom-0 left-0 w-full h-full p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 text-white rounded">
                <div className="flex flex-row absolute top-2 right-2 text-white text-2xl">
                  <button onClick={showUserImageGroups}>
                    <MdExpandMore />
                  </button>
                  <button onClick={() => saveImgToSelectedImgGroup(picture)}>
                    <LiaSaveSolid />
                  </button>
                </div>
                <p className="font-bold">{picture.prompt || 'No prompt'}</p>
                <p className="text-sm">
                  Created by: {picture.createdBy.userEmail}
                </p>
              </div>
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>

      {/* Fullscreen Modal */}
      {selectedImage && (
        <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-80 z-50">
          <Image
            src={selectedImage}
            alt="Full Size Image"
            className="max-w-full max-h-full  h-max w-max cursor-pointer"
            width={0}
            height={0}
            sizes={'100vw'}
            onClick={closeImage}
          />
        </div>
      )}
    </div>
  );
};

export default ImageGrid;

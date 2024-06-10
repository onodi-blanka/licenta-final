import React, { useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Image from 'next/image';

const ImageGrid: React.FC<{ pictures: any[] }> = ({ pictures }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const openImage = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

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
            className="max-w-full max-h-full  h-full w-max"
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

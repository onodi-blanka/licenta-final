'use client';
import React, { useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import Dalle3MockAPI from './Dalle3API';
import MyImg from './MyImg';
import useDebounce from '../app/hooks/debounce';
import { useAllPictures } from '../app/hooks/useAllPictures';
import { useRouter } from 'next/navigation';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [currentImage, setCurrentImage] = useState<string>('');
  const { pictures, loading, error } = useAllPictures();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const router = useRouter();
  const handleCreateWallpaper = () => {
    router.push('/create');
  };

  console.log('Pictures:', pictures); // Add this line for debugging

  return (
    <div className="relative w-full h-screen">
      <div className="flex justify-between items-center py-4 px-8">
        <p>Logo</p>
        <button className="border-transparent p-1 rounded-full hover:bg-gray-300">
          Main page
        </button>
        <button
          className="border-transparent p-1 rounded-full hover:bg-gray-300"
          onClick={handleCreateWallpaper}>
          Create Wallpaper
        </button>
        <input
          className="border border-transparent rounded-full bg-gray-50 px-4 py-2 w-1/3"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button className="px-4 py-2 flex items-center rounded-full border-transparent hover:bg-gray-300">
          <IoMdNotifications className="text-2xl" />
        </button>
        <button className="px-4 py-2 flex items-center rounded-full border-transparent hover:bg-gray-300">
          <BiMessageRoundedDetail className="text-2xl" />
        </button>
        <button className="px-4 py-2 flex items-center rounded-full border-transparent hover:bg-gray-300">
          UserAccount Icon
        </button>
      </div>
      <div className="p-4">
        <Dalle3MockAPI
          searchQuery={debouncedSearchQuery}
          setCurrentImage={setCurrentImage}
        />
      </div>

      <div>
        <MyImg src={currentImage} />
      </div>

      <div className="p-4">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pictures.map((picture) => (
            <div key={picture.id} className="bg-white p-4 rounded shadow-md">
              <img
                src={picture.imageUrl}
                alt={picture.prompt || 'Generated Image'}
                className="w-full h-auto rounded"
              />
              <p className="mt-2 text-center">
                {picture.prompt || 'No prompt available'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

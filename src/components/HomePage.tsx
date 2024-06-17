'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { BiMessageRoundedDetail } from 'react-icons/bi';
// import Dalle3MockAPI from './Dalle3API';
import MyImg from './MyImg';
import useDebounce from '../app/hooks/debounce';
// import { usePicturesByUser } from '../app/hooks//firebase/usePictures';
import { useRouter } from 'next/navigation';
import ImageGrid from '@/components/ImageGrid';
import { User } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useAllPictures } from '@/app/hooks/useAllPictures';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { pictures, loading, error } = useAllPictures();

  // const personalPics = pictures.filter((pic) => {
  //   return (
  //     pic.createdBy === currentUser?.uid ||
  //     pic.createdBy?.userId === currentUser?.uid
  //   );
  // });

  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const router = useRouter();
  const handleCreateWallpaper = () => {
    router.push('/create');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  console.log('Pictures:', pictures);

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
        <button
          className="px-4 py-2 flex items-center rounded-full border-transparent hover:bg-gray-300"
          onClick={handleProfile}>
          UserAccount Icon
        </button>
      </div>

      <ImageGrid pictures={pictures} />
    </div>
  );
};

export default HomePage;

'use client';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { IoMdNotifications } from 'react-icons/io';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { FaRegUser } from 'react-icons/fa';
import useDebounce from '../app/hooks/debounce';
import { useRouter } from 'next/navigation';
import ImageGrid from '@/components/ImageGrid';
import { User } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { useAllPictures } from '@/app/hooks/useAllPictures';
import { useUserImageGroups } from '@/app/hooks/firebase/useUserImageGroups';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { pictures, loading, error, likePicture } = useAllPictures();
  const { imageGroups } = useUserImageGroups(currentUser?.uid || '');
  const [notifications, setNotifications] = useState<
    { prompt: string; likesDifference: number }[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useLayoutEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const newNotifications: { prompt: string; likesDifference: number }[] = [];
    const pictureGroupIds = new Set<string>();

    imageGroups.forEach((group) => {
      group.pictures.forEach((picture) => {
        pictureGroupIds.add(picture.id);
      });
    });

    pictures.forEach((picture) => {
      if (pictureGroupIds.has(picture.id)) {
        const storedPicture = JSON.parse(
          localStorage.getItem(picture.id) || '{}',
        );
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - (storedPicture.timestamp || 0);
        const oneMinute = 60 * 1000;

        if (
          storedPicture.likesCount !== undefined &&
          storedPicture.likesCount !== picture.likesCount
        ) {
          newNotifications.push({
            prompt: picture.prompt,
            likesDifference: picture.likesCount - storedPicture.likesCount,
          });
        }

        if (timeDiff > oneMinute) {
          localStorage.setItem(
            picture.id,
            JSON.stringify({
              prompt: picture.prompt,
              likesCount: picture.likesCount,
              timestamp: currentTime,
            }),
          );
        }
      }
    });

    setNotifications(newNotifications);
  }, [pictures, imageGroups]);

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

  const filteredPictures = pictures.filter((picture) =>
    picture.prompt?.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="relative w-full h-screen">
      <Header
        handleCreateWallpaper={handleCreateWallpaper}
        handleProfile={handleProfile}
        handleSearchChange={handleSearchChange}
        searchQuery={searchQuery}
        notifications={notifications}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
      />
      {filteredPictures.length === 0 ? (
        <div className="flex flex-col pt-20 h-80 text-center justify-between self-center w-full">
          <h2 className="text-2xl">No picture found!</h2>
          <h2 className="text-2xl">Do you want to create this wallpaper?</h2>
          <button
            className="border-transparent w-1/4 self-center p-1 hover:bg-gray-300 bg-black/15 rounded-xl"
            onClick={handleCreateWallpaper}>
            Create
          </button>
        </div>
      ) : (
        <ImageGrid onLikePicture={likePicture} pictures={filteredPictures} />
      )}
      {showNotifications && (
        <NotificationDialog
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

const Header: React.FC<{
  handleCreateWallpaper: () => void;
  handleProfile: () => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchQuery: string;
  notifications: { prompt: string; likesDifference: number }[];
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
  handleCreateWallpaper,
  handleProfile,
  handleSearchChange,
  searchQuery,
  notifications,
  showNotifications,
  setShowNotifications,
}) => {
  return (
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
      <button
        className={`px-4 py-2 flex items-center rounded-full border-transparent hover:bg-gray-300 ${
          notifications.length > 0 ? 'text-red-500' : ''
        }`}
        onClick={() => setShowNotifications(!showNotifications)}>
        <IoMdNotifications className="text-2xl" />
      </button>
      <button className="px-4 py-2 flex items-center rounded-full border-transparent hover:bg-gray-300">
        <BiMessageRoundedDetail className="text-2xl" />
      </button>
      <button
        className="px-4 py-2 flex items-center rounded-full border-transparent hover:bg-gray-300"
        onClick={handleProfile}>
        <FaRegUser />
      </button>
    </div>
  );
};

const NotificationDialog: React.FC<{
  notifications: { prompt: string; likesDifference: number }[];
  onClose: () => void;
}> = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-0 right-0 mt-12 mr-12 bg-white border rounded-lg shadow-lg p-4 z-50">
      <button onClick={onClose} className="absolute top-2 right-2">
        Close
      </button>
      <h2 className="font-bold mb-2">Notifications</h2>
      {notifications.map((notification, index) => (
        <p key={index}>
          {notification.prompt} -{' '}
          <b className="text-red-500">{notification.likesDifference}</b> new
          likes
        </p>
      ))}
    </div>
  );
};

export default HomePage;

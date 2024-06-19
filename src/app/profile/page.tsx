'use client';
import Modal from '@/components/Modal';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/authContext';
import { useUserImageGroups } from '@/app/hooks/firebase/useUserImageGroups';
import Image from 'next/image';
import { User, PictureGroup, Picture } from '@/types/enitites';
import { PiUserCircleLight } from 'react-icons/pi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useDeletePictureFromGroup } from '../hooks/firebase/useDeletePicture';
import { Switch } from '@/components/ui/switch';

import {
  getPicturesByIds,
  getPictureById,
} from '../hooks/firebase/getPictureById';
import { group } from 'console';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { imageGroups, loading, error, fetchImageGroups } = useUserImageGroups(
    currentUser?.uid || '',
  );
  const [currentPictureGroup, setCurrentPictureGroup] =
    useState<PictureGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPictures, setCurrentPictures] = useState<Picture[]>([]);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: Picture[] }>(
    {},
  );
  const atIndex = currentUser.email?.indexOf('@');
  const {
    deletePictureFromGroup,
    loading: deleteLoading,
    error: deleteError,
  } = useDeletePictureFromGroup();
  console.log(imageGroups);
  const handleSwitch = (e: Event, group: PictureGroup) => {
    e.stopPropagation();
    if (group.isPrivate) {
      group.isPrivate = false;
    } else {
      group.isPrivate = true;
    }
  };

  useEffect(() => {
    if (!currentUser) {
      console.log('Please log in');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      console.log('Fetching thumbnails...');
      const thumbnailPromises = imageGroups.map(async (group) => {
        const thumbnailIds = group.pictures.slice(0, 3).map((pic) => pic.id);
        const thumbnailPictures = await getPicturesByIds(thumbnailIds);
        return { groupId: group.id, pictures: thumbnailPictures };
      });

      const thumbnailResults = await Promise.all(thumbnailPromises);
      const thumbnailsMap: { [key: string]: Picture[] } = {};
      thumbnailResults.forEach((result) => {
        thumbnailsMap[result.groupId] = result.pictures;
      });
      setThumbnails(thumbnailsMap);
      console.log('Fetched thumbnails:', thumbnailsMap);
    };

    if (imageGroups.length > 0) {
      fetchThumbnails();
    }
  }, [imageGroups]);

  useEffect(() => {
    const fetchPictures = async () => {
      if (currentPictureGroup) {
        console.log('Fetching pictures for group:', currentPictureGroup.id);
        const pictures = await Promise.all(
          currentPictureGroup.pictures.map(async (pic) => {
            return await getPictureById(pic.id);
          }),
        );
        setCurrentPictures(pictures.filter((pic) => pic !== null) as Picture[]);
        console.log('Fetched pictures:', pictures);
      }
    };
    fetchPictures();
  }, [currentPictureGroup]);

  const handleOpenPictureGroup = (group: PictureGroup) => {
    console.log('Opening picture group:', group.id);
    setCurrentPictureGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
    setCurrentPictureGroup(null);
    setCurrentPictures([]);
  };

  const handleDeletePicture = async (pictureId: string) => {
    if (!currentUser || !currentPictureGroup) return;
    try {
      console.log(
        `Deleting picture ${pictureId} from group ${currentPictureGroup.id}`,
      );
      await deletePictureFromGroup(
        currentUser.uid,
        currentPictureGroup.id!,
        pictureId,
      );
      console.log(
        `Deleted picture ${pictureId} from group ${currentPictureGroup.id}`,
      );

      // Remove the picture from the local state after deletion
      setCurrentPictures(currentPictures.filter((pic) => pic.id !== pictureId));

      // Update the imageGroups state from Firestore
      await fetchImageGroups();
      console.log('Refetched image groups');
    } catch (error) {
      console.error('Error deleting picture:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!currentUser) return <div>Please log in</div>;

  return (
    <div className="flex flex-col m-8 items-center">
      <div className="flex flex-col items-center">
        <PiUserCircleLight className="text-8xl mb-2" />
        <div className="mb-12 text-black font-bold">
          {currentUser.email?.substring(0, atIndex)}
        </div>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-6">
        {imageGroups.map((group) => (
          <div
            key={group.id}
            className="group relative cursor-pointer border p-3 rounded-lg text-center shadow-lg"
            onClick={() => handleOpenPictureGroup(group)}>
            {group.pictures.length === 0 ? (
              <div>No pictures found</div>
            ) : (
              group.id &&
              thumbnails[group.id] &&
              thumbnails[group.id].length > 0 && (
                <div className="flex flex-row gap-1">
                  <Image
                    alt="img"
                    src={thumbnails[group.id][0].imageUrl}
                    width={200}
                    height={200}
                    className="aspect-square"
                  />
                </div>
              )
            )}
            <div>
              <div className="group-hover:visible top-0  left-0 invisible absolute text-2xl">
                <RiDeleteBin6Line />
              </div>
              <div className="absolute top-0 right-0">
                <Switch
                  checked={group.isPrivate}
                  onClick={(e) => handleSwitch(e, group)}
                />
              </div>
            </div>
            <div className="font-bold">{group.name}</div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col gap-6 max-h-screen">
          <div>
            <h2 className="text-2xl font-bold">
              {currentPictureGroup?.name || 'Collection'}
            </h2>
          </div>
          <div className="mb-16 flex flex-col gap-3 items-center overflow-y-scroll max-h-fit">
            {currentPictures.length > 0 &&
              currentPictures.map((pic) => (
                <div
                  key={pic.id}
                  className="relative group"
                  onClick={(e) => e.stopPropagation()}>
                  <Image
                    src={pic.imageUrl}
                    alt={pic.prompt || 'Generated picture'}
                    width={400}
                    height={200}
                    className="shadow-lg rounded-lg"
                  />
                  <div
                    className="group-hover:visible top-3 right-3 invisible absolute text-2xl cursor-pointer"
                    onClick={() => handleDeletePicture(pic.id)}>
                    <RiDeleteBin6Line />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

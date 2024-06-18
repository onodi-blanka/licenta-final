'use client';
import Modal from '@/components/Modal';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/authContext';
import { useUserImageGroups } from '@/app/hooks/firebase/useUserImageGroups';
import Image from 'next/image';
import { User, PictureGroup, Picture } from '@/types/enitites';
import {
  getPicturesByIds,
  getPictureById,
} from '../hooks/firebase/getPictureById';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const { imageGroups, loading, error } = useUserImageGroups(
    currentUser?.uid || '',
  );
  const [currentPictureGroup, setCurrentPictureGroup] =
    useState<PictureGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPictures, setCurrentPictures] = useState<Picture[]>([]);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: Picture[] }>(
    {},
  );

  useEffect(() => {
    if (!currentUser) {
      console.log('Please log in');
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchThumbnails = async () => {
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
    };

    if (imageGroups.length > 0) {
      fetchThumbnails();
    }
  }, [imageGroups]);

  useEffect(() => {
    const fetchPictures = async () => {
      if (currentPictureGroup) {
        const pictures = await Promise.all(
          currentPictureGroup.pictures.map(async (pic) => {
            return await getPictureById(pic.id);
          }),
        );
        setCurrentPictures(pictures.filter((pic) => pic !== null) as Picture[]);
      }
    };
    fetchPictures();
  }, [currentPictureGroup]);

  const handleOpenPictureGroup = (group: PictureGroup) => {
    setCurrentPictureGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPictureGroup(null);
    setCurrentPictures([]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!currentUser) return <div>Please log in</div>;

  return (
    <div className="flex flex-col m-8 items-center">
      <div>My profile settings</div>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-6">
        {imageGroups.map((group) => (
          <div
            key={group.id}
            className="cursor-pointer border p-3 rounded-lg text-center shadow-lg"
            onClick={() => handleOpenPictureGroup(group)}>
            {thumbnails[group.id] &&
              thumbnails[group.id].length > 0 &&
              (thumbnails[group.id].length < 3 ? (
                <div className="flex flex-row gap-1">
                  <Image
                    alt="img"
                    src={thumbnails[group.id][0].imageUrl}
                    width={200}
                    height={200}
                    className="aspect-square"
                  />
                </div>
              ) : (
                <div className="flex flex-row gap-1">
                  <Image
                    alt="img"
                    src={thumbnails[group.id][0].imageUrl}
                    width={200}
                    height={200}
                    className="aspect-square"
                  />
                  <div className="flex flex-col gap-1">
                    <Image
                      alt="img"
                      src={thumbnails[group.id][1].imageUrl}
                      width={100}
                      height={100}
                      className="aspect-square"
                    />
                    <Image
                      alt="img"
                      src={thumbnails[group.id][2].imageUrl}
                      width={100}
                      height={100}
                      className="aspect-square"
                    />
                  </div>
                </div>
              ))}
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
            {currentPictures.map((pic) => (
              <Image
                key={pic.id}
                src={pic.imageUrl}
                alt={pic.prompt || 'Generated picture'}
                width={400}
                height={200}
                className="shadow-lg rounded-lg"
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/authContext';
import { useUserImageGroups } from '@/app/hooks/firebase/useUserImageGroups';
import ProfileHeader from '@/app/profile/profileComponents/ProfileHeader';
import PictureGroupCard from '@/app/profile/profileComponents/PictureGroupCard';
import PictureGroupModal from '@/app/profile/profileComponents/PictureGroupModal';
import { getPicturesByIds } from '../hooks/firebase/getPictureById';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    imageGroups,
    loading,
    error,
    fetchImageGroups,
    toggleGroupPrivacy,
    deletePictureGroup,
    removePictureFromGroup,
  } = useUserImageGroups(currentUser?.uid || '');
  const [currentPictureGroup, setCurrentPictureGroup] =
    useState<PictureGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState<{ [key: string]: Picture[] }>(
    {},
  );

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

  useEffect(() => {
    if (imageGroups.length > 0) {
      fetchThumbnails();
    }
  }, [imageGroups]);

  const handleOpenPictureGroup = (group: PictureGroup) => {
    setCurrentPictureGroup(group);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPictureGroup(null);
  };

  const handleDeletePicture = async (pictureId: string) => {
    if (!currentUser || !currentPictureGroup) return;
    try {
      await removePictureFromGroup(pictureId, currentPictureGroup.id!);
      await fetchImageGroups();
    } catch (error) {
      console.error('Error removing picture from group:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentUser) return <div>Please log in</div>;

  return (
    <div className="flex flex-col m-8 items-center">
      <ProfileHeader email={currentUser.email} />
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-6">
        {imageGroups.map((group) => (
          <PictureGroupCard
            key={group.id}
            group={group}
            thumbnails={thumbnails[group.id] || []}
            handleSwitch={toggleGroupPrivacy}
            handleOpenPictureGroup={handleOpenPictureGroup}
            handleDeleteGroup={deletePictureGroup}
          />
        ))}
      </div>
      <PictureGroupModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentPictureGroup={currentPictureGroup}
        handleDeletePicture={handleDeletePicture}
      />
    </div>
  );
};

export default Profile;

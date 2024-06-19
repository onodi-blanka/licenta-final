import React, { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import Image from 'next/image';
import { useAuth } from '@/authContext';
import { useUserImageGroups } from '@/app/hooks/firebase/useUserImageGroups';
import { Picture, PictureGroup } from '@/types/enitites';
import { IoMdHeart } from 'react-icons/io';

interface ImageGridProps {
  pictures: Picture[];
  onLikePicture: (pictureId: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ pictures, onLikePicture }) => {
  const { currentUser } = useAuth();
  const {
    imageGroups,
    loading,
    error,
    addPictureToGroup,
    createGroupAndAddPicture,
  } = useUserImageGroups(currentUser?.uid || '', pictures);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showGroups, setShowGroups] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [hoveredPicture, setHoveredPicture] = useState<Picture | null>(null);
  const [likedPictures, setLikedPictures] = useState<Set<string>>(new Set());

  const handleImageClick = (imageUrl: string) => setSelectedImage(imageUrl);

  const handleCloseImage = () => setSelectedImage(null);

  const handleShowGroups = (e: React.MouseEvent, picture: Picture) => {
    e.stopPropagation();
    setHoveredPicture(picture);
    setShowGroups((prev) => !prev);
    console.log(`Showing groups for picture ${picture.id}`);
  };

  const handleAddToGroup = async (groupId: string) => {
    if (hoveredPicture) {
      console.log(`Adding picture ${hoveredPicture.id} to group ${groupId}`);
      await addPictureToGroup(hoveredPicture.id, groupId);
      resetGroupState();
    }
  };

  const handleCreateNewGroup = async () => {
    if (newGroupName.trim() && hoveredPicture) {
      console.log(
        `Creating new group ${newGroupName} and adding picture ${hoveredPicture.id}`,
      );
      await createGroupAndAddPicture(hoveredPicture.id, newGroupName);
      resetGroupState();
      setNewGroupName('');
    }
  };

  const resetGroupState = () => {
    setShowGroups(false);
    setHoveredPicture(null);
    console.log('Resetting group state');
  };

  const handleLikePicture = (pictureId: string) => {
    onLikePicture(pictureId);
    setLikedPictures((prev) => {
      const newLikedPictures = new Set(prev);
      if (newLikedPictures.has(pictureId)) {
        newLikedPictures.delete(pictureId);
      } else {
        newLikedPictures.add(pictureId);
      }
      return newLikedPictures;
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  if (!pictures || pictures.length === 0) {
    return <p>No pictures found</p>;
  }

  return (
    <div className="p-4">
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
        <Masonry gutter="20px">
          {pictures.map((picture) => (
            <div
              key={picture.id}
              className="relative group"
              onMouseEnter={() => setHoveredPicture(picture)}
              onMouseLeave={() => setHoveredPicture(null)}>
              <Image
                src={picture.imageUrl}
                width={0}
                height={0}
                onClick={() => handleImageClick(picture.imageUrl)}
                sizes="100vw"
                alt={picture.prompt || 'Generated Image'}
                className="w-full h-auto rounded mb-2 z-10"
              />
              {hoveredPicture?.id === picture.id && (
                <HoverDetails
                  picture={picture}
                  showGroups={showGroups}
                  imageGroups={imageGroups}
                  newGroupName={newGroupName}
                  onShowGroups={handleShowGroups}
                  onAddToGroup={handleAddToGroup}
                  onCreateNewGroup={handleCreateNewGroup}
                  onNewGroupNameChange={setNewGroupName}
                  isLiked={likedPictures.has(picture.id)}
                  onLikePicture={handleLikePicture}
                />
              )}
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
      {selectedImage && (
        <FullscreenModal imageUrl={selectedImage} onClose={handleCloseImage} />
      )}
    </div>
  );
};

interface HoverDetailsProps {
  picture: Picture;
  showGroups: boolean;
  imageGroups: PictureGroup[];
  newGroupName: string;
  onShowGroups: (e: React.MouseEvent, picture: Picture) => void;
  onAddToGroup: (groupId: string) => void;
  onCreateNewGroup: () => void;
  onNewGroupNameChange: (name: string) => void;
  isLiked: boolean;
  onLikePicture: (pictureId: string) => void;
}

const HoverDetails: React.FC<HoverDetailsProps> = ({
  picture,
  showGroups,
  imageGroups,
  newGroupName,
  onShowGroups,
  onAddToGroup,
  onCreateNewGroup,
  onNewGroupNameChange,
  isLiked,
  onLikePicture,
}) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-full p-4 flex flex-col z-50 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 text-white rounded">
      <div className="flex flex-row absolute top-2 right-2 text-white text-2xl">
        <button className="z-50" onClick={(e) => onShowGroups(e, picture)}>
          <MdExpandMore />
        </button>
        <button className="z-50" onClick={() => onLikePicture(picture.id)}>
          <IoMdHeart
            className={`hover:animate-pulse ${isLiked ? 'text-red-500' : 'text-white'}`}
          />
        </button>
      </div>
      {showGroups && (
        <div className="absolute top-12 right-2 bg-white text-black rounded shadow-md p-2">
          <p className="font-bold mb-2">Select a group:</p>
          {imageGroups.map((group) => (
            <p
              key={group.id}
              className="cursor-pointer hover:bg-gray-200 p-1"
              onClick={() => onAddToGroup(group.id)}>
              {group.name}
            </p>
          ))}
          <div className="mt-2">
            <input
              type="text"
              className="p-1 border rounded w-full"
              placeholder="New group name"
              value={newGroupName}
              onChange={(e) => onNewGroupNameChange(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-1 rounded mt-1"
              onClick={onCreateNewGroup}>
              Create Group
            </button>
          </div>
        </div>
      )}
      <p className="font-bold">{picture.prompt || 'No prompt'}</p>
      <p className="text-sm">Created by: {picture.createdBy.userEmail}</p>
    </div>
  );
};

interface FullscreenModalProps {
  imageUrl: string;
  onClose: () => void;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({
  imageUrl,
  onClose,
}) => (
  <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-80 z-50">
    <Image
      src={imageUrl}
      alt="Full Size Image"
      className="max-w-full max-h-full h-max w-max cursor-pointer"
      width={0}
      height={0}
      sizes="100vw"
      onClick={onClose}
    />
  </div>
);

export default ImageGrid;

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import Image from 'next/image';
import { Picture, PictureGroup } from '@/types/enitites';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { getPictureById } from '@/app/hooks/firebase//getPictureById';

interface PictureGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPictureGroup: PictureGroup | null;
  handleDeletePicture: (pictureId: string) => void;
}

const PictureGroupModal: React.FC<PictureGroupModalProps> = ({
  isOpen,
  onClose,
  currentPictureGroup,
  handleDeletePicture,
}) => {
  const [currentPictures, setCurrentPictures] = useState<Picture[]>([]);

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

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
                //   random
                key={pic.id}
                className="relative group"
                // onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={pic.imageUrl}
                  alt={pic.prompt || 'Generated picture'}
                  width={400}
                  height={200}
                  className="shadow-lg rounded-lg"
                />
                <div
                  className="group-hover:visible top-3 right-3 invisible absolute text-2xl cursor-pointer p-2 rounded-xl bg-black/40 backdrop-blur-xl shadow-lg"
                  onClick={() => handleDeletePicture(pic.id)}>
                  <RiDeleteBin6Line className="text-red-500" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
};

export default PictureGroupModal;

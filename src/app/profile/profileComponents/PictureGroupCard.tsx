import React from 'react';
import { PictureGroup, Picture } from '@/types/enitites';
import Image from 'next/image';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Switch } from '@/components/ui/switch';

interface PictureGroupCardProps {
  group: PictureGroup;
  thumbnails: Picture[];
  handleSwitch: (groupId: string) => Promise<void>;
  handleOpenPictureGroup: (group: PictureGroup) => void;
  handleDeleteGroup: (groupId: string) => Promise<void>;
}

const PictureGroupCard: React.FC<PictureGroupCardProps> = ({
  group,
  thumbnails,
  handleSwitch,
  handleOpenPictureGroup,
  handleDeleteGroup,
}) => {
  const handleTogglePrivacy = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleSwitch(group.id!);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleDeleteGroup(group.id!);
  };

  return (
    <div
      key={group.id}
      className="group flex flex-col gap-2 relative cursor-pointer border p-3 rounded-lg text-center shadow-lg"
      onClick={() => handleOpenPictureGroup(group)}>
      <div className="font-bold text-center">{group.name}</div>
      {group.pictures.length === 0 ? (
        <div>No pictures found</div>
      ) : (
        group.id &&
        thumbnails.length > 0 && (
          <div className="flex flex-row gap-1">
            <Image
              alt="img"
              src={thumbnails[0].imageUrl}
              width={200}
              height={200}
              className="aspect-square"
            />
          </div>
        )
      )}
      <div className="flex">
        <div
          className="group-hover:visible top-1 right-3 invisible absolute text-2xl cursor-pointer bg-black/40 shadow-xl rounded-xl p-2 "
          onClick={handleDelete}>
          <RiDeleteBin6Line className="text-red-500 " />
        </div>
      </div>
      <div>
        <div className="flex flex-row justify-between">
          <p>Is private</p>
          <Switch checked={group.isPrivate} onClick={handleTogglePrivacy} />
        </div>
      </div>
    </div>
  );
};

export default PictureGroupCard;

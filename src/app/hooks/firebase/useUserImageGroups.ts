import { useState, useEffect } from 'react';
import useFetchUserData from './useFetchUserData';
import useUpdateUserData from './useUpdateUserData';
import { Picture, PictureGroup } from '@/types/enitites';
import { db } from '@/firebase/firebase';
import { doc, collection, arrayRemove, updateDoc } from 'firebase/firestore';

interface UseUserImageGroupsResult {
  imageGroups: PictureGroup[];
  loading: boolean;
  error: string | null;
  fetchImageGroups: () => Promise<void>;
  addPictureToGroup: (pictureId: string, groupId: string) => Promise<void>;
  createGroupAndAddPicture: (
    pictureId: string,
    groupName: string,
  ) => Promise<void>;
  toggleGroupPrivacy: (groupId: string) => Promise<void>;
  deletePictureGroup: (groupId: string) => Promise<void>;
  removePictureFromGroup: (pictureId: string, groupId: string) => Promise<void>;
}

export const useUserImageGroups = (
  userId: string,
): UseUserImageGroupsResult => {
  const [imageGroups, setImageGroups] = useState<PictureGroup[]>([]);
  const {
    userData,
    loading: fetchLoading,
    error: fetchError,
    fetchUserData,
  } = useFetchUserData(userId);
  const {
    loading: updateLoading,
    error: updateError,
    updateUserData,
  } = useUpdateUserData();

  const loading = fetchLoading || updateLoading;
  const error = fetchError || updateError;

  const fetchImageGroups = async () => {
    await fetchUserData();
  };

  useEffect(() => {
    if (userData) {
      setImageGroups(userData.pictureGroups || []);
    }
  }, [userData]);

  const addPictureToGroup = async (pictureId: string, groupId: string) => {
    const groupIndex = imageGroups.findIndex((group) => group.id === groupId);
    if (groupIndex === -1) throw new Error('Group not found');

    const updatedGroups = [...imageGroups];
    updatedGroups[groupIndex].pictures.push({ id: pictureId } as Picture);

    await updateUserData(userId, { pictureGroups: updatedGroups });
    setImageGroups(updatedGroups);
  };

  const createGroupAndAddPicture = async (
    pictureId: string,
    groupName: string,
  ) => {
    const newGroupId = doc(collection(db, 'pictureGroups')).id;
    const newGroup: PictureGroup = {
      id: newGroupId,
      name: groupName,
      pictures: [{ id: pictureId } as Picture],
      isPrivate: false,
    };

    const updatedGroups = [newGroup, ...imageGroups];
    await updateUserData(userId, { pictureGroups: updatedGroups });
    setImageGroups(updatedGroups);
  };

  const toggleGroupPrivacy = async (groupId: string) => {
    const groupIndex = imageGroups.findIndex((group) => group.id === groupId);
    if (groupIndex === -1) throw new Error('Group not found');

    const updatedGroups = [...imageGroups];
    updatedGroups[groupIndex].isPrivate = !updatedGroups[groupIndex].isPrivate;

    await updateUserData(userId, { pictureGroups: updatedGroups });
    setImageGroups(updatedGroups);
  };

  const deletePictureGroup = async (groupId: string) => {
    const updatedGroups = imageGroups.filter((group) => group.id !== groupId);
    await updateUserData(userId, { pictureGroups: updatedGroups });
    setImageGroups(updatedGroups);
  };

  const removePictureFromGroup = async (pictureId: string, groupId: string) => {
    console.log(pictureId);
    const groupIndex = imageGroups.findIndex((group) => group.id === groupId);
    if (groupIndex === -1) throw new Error('Group not found');

    const updatedGroups = [...imageGroups];
    updatedGroups[groupIndex].pictures = updatedGroups[
      groupIndex
    ].pictures.filter((picture) => picture.id !== pictureId);

    await updateUserData(userId, { pictureGroups: updatedGroups });

    // Update the picture document to remove the groupId
    const pictureRef = doc(db, 'pictures', pictureId);
    await updateDoc(pictureRef, {
      groups: arrayRemove(groupId),
    });

    setImageGroups(updatedGroups);
  };

  return {
    imageGroups,
    loading,
    error,
    fetchImageGroups,
    addPictureToGroup,
    createGroupAndAddPicture,
    toggleGroupPrivacy,
    deletePictureGroup,
    removePictureFromGroup,
  };
};

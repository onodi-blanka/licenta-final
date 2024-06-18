import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { Picture, PictureGroup } from '@/types/enitites';

interface UseUserImageGroupsResult {
  imageGroups: PictureGroup[];
  loading: boolean;
  error: string | null;
  addPictureToGroup: (pictureId: string, groupId: string) => Promise<void>;
  createGroupAndAddPicture: (
    pictureId: string,
    groupName: string,
  ) => Promise<void>;
}

export const useUserImageGroups = (
  userId: string,
): UseUserImageGroupsResult => {
  const [imageGroups, setImageGroups] = useState<PictureGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImageGroups = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, 'users'), where('id', '==', userId));
        const querySnapshot = await getDocs(q);
        const userData = querySnapshot.docs.map((doc) => doc.data())[0];

        let groups: PictureGroup[] = [];
        if (userData) {
          groups = userData.pictureGroups || [];
        }

        setImageGroups(groups);
        console.log('Fetched image groups:', groups);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching image groups:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchImageGroups();
    }
  }, [userId]);

  const addPictureToGroup = async (pictureId: string, groupId: string) => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = collection(db, 'users');
      const q = query(userDocRef, where('id', '==', userId));
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];

      if (!userDoc) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const groupIndex = userData.pictureGroups.findIndex(
        (group: PictureGroup) => group.id === groupId,
      );

      if (groupIndex === -1) {
        throw new Error('Group not found');
      }

      userData.pictureGroups[groupIndex].pictures.push({
        id: pictureId,
      } as Picture);

      await updateDoc(doc(userDocRef, userDoc.id), {
        pictureGroups: userData.pictureGroups,
      });

      setImageGroups((prevGroups) => {
        const updatedGroups = [...prevGroups];
        updatedGroups[groupIndex].pictures.push({ id: pictureId } as Picture);
        return updatedGroups;
      });

      console.log(`Added picture ${pictureId} to group ${groupId}`);
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding picture to group:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const createGroupAndAddPicture = async (
    pictureId: string,
    groupName: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = collection(db, 'users');
      const q = query(userDocRef, where('id', '==', userId));
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];

      if (!userDoc) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();

      if (!userData.pictureGroups) {
        userData.pictureGroups = [];
      }

      const newGroupRef = doc(collection(db, 'pictureGroups'));
      const newGroupId = newGroupRef.id;

      const newGroup: PictureGroup = {
        id: newGroupId,
        name: groupName,
        pictures: [{ id: pictureId } as Picture],
        isPrivate: false,
      };

      userData.pictureGroups.push(newGroup);

      await updateDoc(doc(userDocRef, userDoc.id), {
        pictureGroups: userData.pictureGroups,
      });

      setImageGroups((prevGroups) => [newGroup, ...prevGroups]);

      console.log(
        `Created new group ${groupName} with ID ${newGroupId} and added picture ${pictureId}`,
      );
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating group and adding picture:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    imageGroups,
    loading,
    error,
    addPictureToGroup,
    createGroupAndAddPicture,
  };
};

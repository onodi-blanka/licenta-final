import { useState } from 'react';
import { db } from '@/firebase/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { PictureGroup, Picture } from '@/types/enitites';

interface UseDeletePictureResult {
  deletePictureFromGroup: (
    userId: string,
    pictureGroupId: string,
    pictureId: string,
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useDeletePictureFromGroup = (): UseDeletePictureResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deletePictureFromGroup = async (
    userId: string,
    pictureGroupId: string,
    pictureId: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const pictureGroups = userData.pictureGroups || [];

        const updatedGroups = pictureGroups.map((group: PictureGroup) => {
          if (group.id === pictureGroupId) {
            return {
              ...group,
              pictures: group.pictures.filter(
                (pic: Picture) => pic.id !== pictureId,
              ),
            };
          }
          return group;
        });

        await updateDoc(userDocRef, { pictureGroups: updatedGroups });
        console.log(
          `Deleted picture with id: ${pictureId} from group: ${pictureGroupId}`,
        );
      } else {
        throw new Error('User document does not exist');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting picture from group:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return { deletePictureFromGroup, loading, error };
};

import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Picture, PictureGroup } from '@/types/enitites';

export const useUserImageGroups = (userId: string, pictures: Picture[]) => {
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
        const userData = querySnapshot.docs.map((doc) => doc.data());

        let groups: PictureGroup[] = [];
        if (userData.length > 0) {
          groups = userData[0].pictureGroups || [];
        }

        // Add default "Generated Pictures" group
        const generatedPicturesGroup: PictureGroup = {
          id: 'generated-pictures',
          name: 'Generated Pictures',
          pictures: pictures,
          isPrivate: false,
        };

        setImageGroups([generatedPicturesGroup, ...groups]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchImageGroups();
    }
  }, [userId, pictures]);

  return { imageGroups, loading, error };
};

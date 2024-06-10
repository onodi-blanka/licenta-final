import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { Picture } from '../../types/enitites';

export const useAllPictures = () => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPictures = async () => {
      setLoading(true);
      setError(null);

      if (!auth.currentUser) {
        setError('User is not authenticated');
        console.log('User is not authenticated');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching pictures from Firestore');
        const querySnapshot = await getDocs(collection(db, 'pictures'));
        const pics: Picture[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Document data:', data);
          if (data.createdAt && data.createdAt.toDate) {
            data.createdAt = data.createdAt.toDate();
          } else {
            data.createdAt = new Date();
          }
          pics.push({
            id: doc.id,
            imageUrl: data.imageUrl,
            createdBy: data.createdBy,
            createdAt: data.createdAt,
            likesCount: data.likesCount || 0,
            groups: data.groups || [],
            prompt: data.prompt,
          });
        });
        setPictures(pics);
        console.log('Fetched pictures:', pics);
      } catch (error) {
        setError('Failed to fetch pictures.');
        console.error('Error fetching pictures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPictures();
  }, []);

  return { pictures, loading, error };
};

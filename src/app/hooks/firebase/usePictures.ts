import { useEffect, useState } from 'react';
import { db, storage } from '../../../firebase/firebase';
import { Picture } from '../../../types/enitites';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

export const usePicturesByUser = (userId: string) => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPictures = async () => {
      const q = query(
        collection(db, 'pictures'),
        where('createdBy', '==', userId),
      );
      const querySnapshot = await getDocs(q);
      const pics: Picture[] = [];
      querySnapshot.forEach((doc) => {
        pics.push({ id: doc.id, ...doc.data() } as Picture);
      });
      setPictures(pics);
    };

    fetchPictures();
  }, [userId]);

  const addPicture = async (pictureData: Omit<Picture, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const imageRef = ref(storage, `pictures/${Date.now()}.png`);
      await uploadString(imageRef, pictureData.imageUrl, 'data_url', {
        contentType: 'image/png',
      });
      const imageUrl = await getDownloadURL(imageRef);

      const docRef = await addDoc(collection(db, 'pictures'), {
        ...pictureData,
        imageUrl,
        createdBy: userId,
        createdAt: new Date(),
      });
      setPictures((prevPictures) => [
        ...prevPictures,
        {
          id: docRef.id,
          ...pictureData,
          imageUrl,
          createdBy: userId,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      setError('Failed to save picture.');
      console.error('Error saving picture: ', error);
    } finally {
      setLoading(false);
    }
  };

  return { pictures, addPicture, loading, error };
};

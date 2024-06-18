import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Picture } from '@/types/enitites';

interface UsePictureByIdResult {
  picture: Picture | null;
  loading: boolean;
  error: string | null;
}

export const usePictureById = (pictureId: string): UsePictureByIdResult => {
  const [picture, setPicture] = useState<Picture | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPicture = async () => {
      setLoading(true);
      setError(null);
      try {
        const pictureRef = doc(db, 'pictures', pictureId);
        const pictureDoc = await getDoc(pictureRef);

        if (pictureDoc.exists()) {
          setPicture(pictureDoc.data() as Picture);
          console.log('Fetched picture:', pictureDoc.data());
        } else {
          throw new Error('Picture not found');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching picture:', err.message);
      } finally {
        setLoading(false);
      }
    };

    if (pictureId) {
      fetchPicture();
    }
  }, [pictureId]);

  return { picture, loading, error };
};

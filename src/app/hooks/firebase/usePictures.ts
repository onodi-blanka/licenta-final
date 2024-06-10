import { useState, useEffect, useCallback } from 'react';
import { db } from '@/firebase/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Picture } from '@/types/enitites';

export const usePicturesByUser = (userId: string) => {
  const [pictures, setPictures] = useState<Picture[]>([]);
  // const [allPictures, setAllPictures] = useState<Picture[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addPicture = useCallback(async (picture: Omit<Picture, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, 'pictures'), picture);
      setPictures((prevPictures) => [
        ...prevPictures,
        { ...picture, id: docRef.id },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPictures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'pictures'));
      const querySnapshot = await getDocs(q);
      const userPictures: Picture[] = [];
      querySnapshot.forEach((doc) => {
        userPictures.push({ id: doc.id, ...doc.data() } as Picture);
      });
      setPictures(userPictures);
    } catch (err) {
      console.log('here it fails');
      console.log(userId);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // const fetchAllPictures = useCallback(async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const q = query(collection(db, 'pictures'));
  //     const querySnapshot = await getDocs(q);
  //     const userPictures: Picture[] = [];
  //     querySnapshot.forEach((doc) => {
  //       userPictures.push({ id: doc.id, ...doc.data() } as Picture);
  //     });
  //     setAllPictures(userPictures);
  //   } catch (err) {
  //     console.log('here it fails');
  //     console.log(userId);
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchPictures();
    }
  }, [userId, fetchPictures]);

  return {
    pictures,
    addPicture,
    loading,
    error,
    // allPictures,
  };
};

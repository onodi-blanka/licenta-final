import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useFetchUserData = (userId: string) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'users'), where('id', '==', userId));
      const querySnapshot = await getDocs(q);
      const userDoc = querySnapshot.docs[0];

      if (userDoc) {
        setUserData(userDoc.data());
      } else {
        throw new Error('User not found');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching user data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return { userData, loading, error, fetchUserData };
};

export default useFetchUserData;

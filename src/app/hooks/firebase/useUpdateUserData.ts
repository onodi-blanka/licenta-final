import { useState } from 'react';
import { db } from '@/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const useUpdateUserData = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserData = async (userId: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating user data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateUserData };
};

export default useUpdateUserData;

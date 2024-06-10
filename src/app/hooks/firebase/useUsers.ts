// src/hooks/useUsers.ts

import { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebase';
import { User } from '../../../types/enitites';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        setUser({ id: userDoc.id, ...userDoc.data() } as User);
      }
    };

    fetchUser();
  }, [userId]);

  const addUser = async (userData: Omit<User, 'id'>) => {
    await setDoc(doc(db, 'users', userId), userData);
  };

  return { user, addUser };
};

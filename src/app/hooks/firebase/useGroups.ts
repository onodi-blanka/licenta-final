// src/hooks/useGroups.ts

import { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebase';
import { Group } from '../../../types/enitites';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export const useGroupsByUser = (userId: string) => {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const q = query(
        collection(db, 'groups'),
        where('createdBy', '==', userId),
      );
      const querySnapshot = await getDocs(q);
      const grpList: Group[] = [];
      querySnapshot.forEach((doc) => {
        grpList.push({ id: doc.id, ...doc.data() } as Group);
      });
      setGroups(grpList);
    };

    fetchGroups();
  }, [userId]);

  const addGroup = async (groupData: Omit<Group, 'id'>) => {
    await addDoc(collection(db, 'groups'), groupData);
  };

  const assignPictureToGroup = async (pictureId: string, groupId: string) => {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      pictures: arrayUnion(pictureId),
    });

    const pictureRef = doc(db, 'pictures', pictureId);
    await updateDoc(pictureRef, {
      groups: arrayUnion(groupId),
    });
  };

  return { groups, addGroup, assignPictureToGroup };
};

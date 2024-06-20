import { db } from '@/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Picture } from '@/types/enitites';

export const getPictureById = async (
  pictureId: string,
): Promise<Picture | null> => {
  try {
    const pictureRef = doc(db, 'pictures', pictureId);
    const pictureDoc = await getDoc(pictureRef);

    if (pictureDoc.exists()) {
      return { id: pictureDoc.id, ...pictureDoc.data() } as Picture;
    } else {
      console.error('Picture not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching picture:', error);
    return null;
  }
};

export const getPicturesByIds = async (
  pictureIds: string[],
): Promise<Picture[]> => {
  try {
    const pictures = await Promise.all(
      pictureIds.map(async (id) => {
        const pictureRef = doc(db, 'pictures', id);
        const pictureDoc = await getDoc(pictureRef);
        if (pictureDoc.exists()) {
          return { id: pictureDoc.id, ...pictureDoc.data() } as Picture;
        }
        return null;
      }),
    );
    return pictures.filter((pic) => pic !== null) as Picture[];
  } catch (error) {
    console.error('Error fetching pictures:', error);
    return [];
  }
};

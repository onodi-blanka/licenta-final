'use client';
import Collection from '@/components/Collection';
import Modal from '@/components/Modal';
import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { usePicturesByUser } from '@/app/hooks/firebase/usePictures';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import ImageGrid from '@/components/ImageGrid';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { pictures, loading, error } = usePicturesByUser(
    currentUser?.uid || '',
  );
  const [currentCollection, setCurrentCollection] = useState<string | null>(
    null,
  );
  const collections = ['Generated pictures'];
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenCollection = (collectionId: string) => {
    setCurrentCollection(collectionId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCollection(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!currentUser) return <div>Please log in</div>;

  const filteredPictures = pictures.filter(
    (pic) => pic.createdBy.userId === currentUser?.uid,
  );

  return (
    <div className="flex flex-col m-8 items-center">
      <div>My profile settings</div>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-5 gap-6">
        {collections.map((collection) => (
          <div>
            {pictures.length > 0 &&
              (pictures.length < 3 ? (
                <div
                  key={collection}
                  className="cursor-pointer border p-3 rounded-lg text-center shadow-lg"
                  onClick={() => handleOpenCollection(collection)}>
                  <div className="flex flex-row gap-1">
                    <Image
                      alt="img"
                      src={pictures[0].imageUrl}
                      width={200}
                      height={200}
                      className="aspec"
                    />
                  </div>
                </div>
              ) : (
                <div
                  key={collection}
                  className="cursor-pointer border p-3 rounded-lg text-center shadow-lg"
                  onClick={() => handleOpenCollection(collection)}>
                  <div className="flex flex-row gap-1">
                    <Image
                      alt="img"
                      src={pictures[0].imageUrl}
                      width={200}
                      height={200}
                      className="aspec"
                    />
                    <div className="flex flex-col gap-1">
                      <Image
                        alt="img"
                        src={pictures[1].imageUrl}
                        width={100}
                        height={100}
                        className=""
                      />
                      <Image
                        alt="img"
                        src={pictures[2].imageUrl}
                        width={100}
                        height={100}
                      />
                    </div>
                  </div>
                </div>
              ))}
            <div className="font-bold">{collection}</div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex flex-col gap-6 max-h-screen">
          <div>
            <h2 className="text-2xl font-bold">
              {currentCollection || 'Collection'}
            </h2>
          </div>
          <div className="mb-16 flex flex-col gap-3 items-center overflow-y-scroll max-h-fit ">
            {filteredPictures.map((pic) => (
              <Image
                key={pic.id}
                src={pic.imageUrl}
                alt={pic.prompt || 'Generated picture'}
                width={400}
                height={200}
                className="shadow-lg rounded-lg"
              />
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

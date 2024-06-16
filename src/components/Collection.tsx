'use client';
import { Picture } from '@/types/enitites';
import React from 'react';
import ImageGrid from './ImageGrid';

type CollectionProps = {
  name: string;
  handleClick: (collectionId: string) => void;
};

const Collection = ({ name, handleClick }: CollectionProps) => {
  return (
    <div
      className="m-5 border border-red-600"
      onClick={() => handleClick(name)}>
      My Collection name is: {name}
    </div>
  );
};

export default Collection;

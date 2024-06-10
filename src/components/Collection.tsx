'use client';
import { Picture } from '@/types/enitites';
import React from 'react';
import ImageGrid from './ImageGrid';

type CollectionProps = {
  pictures: Picture[];
};

const Collection = ({ pictures }: CollectionProps) => {
  return (
    <div>
      My Collection
      <div>
        <ImageGrid pictures={pictures} />
      </div>
    </div>
  );
};

export default Collection;

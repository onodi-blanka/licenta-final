import React from 'react';
// TODO: remove
type MyImgProps = {
  src: string | undefined;
};

const MyImg = ({ src }: MyImgProps) => {
  return (
    <div>
      <img src={src} alt="Generated" className="w-full rounded" />
    </div>
  );
};

export default MyImg;

import Collection from '@/components/Collection';
import React from 'react';

const Profile = () => {
  return (
    <div className="flex flex-col m-8 items-center">
      <div>My profile settings</div>
      <div className="flex flex-row">
        <Collection pictures={[]} />
        <Collection pictures={[]} />
        <Collection pictures={[]} />
      </div>
    </div>
  );
};

export default Profile;

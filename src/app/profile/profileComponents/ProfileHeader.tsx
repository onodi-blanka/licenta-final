import React from 'react';
import { PiUserCircleLight } from 'react-icons/pi';

interface ProfileHeaderProps {
  email: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ email }) => {
  const atIndex = email.indexOf('@');
  return (
    <div className="flex flex-col items-center">
      <PiUserCircleLight className="text-8xl mb-2" />
      <div className="mb-12 text-black font-bold">
        {email.substring(0, atIndex)}
      </div>
    </div>
  );
};

export default ProfileHeader;

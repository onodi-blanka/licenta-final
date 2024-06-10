import React from 'react';
import { useAuth } from '../authContext/index';
import Link from 'next/link';

const Navbar = () => {
  const { userLoggedIn, logout, currentUser } = useAuth();

  return (
    <nav className="bg-green-900 text-white p-4 flex flex-row w-full">
      <div className="px-4 flex justify-between items-center w-full">
        <div className="text-2xl font-bold">
          <Link href="/">GlimmerGrid</Link>
        </div>
        <div className="">
          {userLoggedIn ? (
            <div className="flex flex-row gap-4">
              {currentUser.email}
              <button onClick={logout} className="hover:underline">
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex flex-row gap-4">
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
              <Link href="/login" className="hover:underline">
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

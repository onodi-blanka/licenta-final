'use client';
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import trees from '../assets/trees.jpg';
import Link from 'next/link';
import Image from 'next/image';

const PasswordResetPage = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
    } catch (err: any) {
      setError('Failed to send password reset email. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="relative w-full h-screen">
      <Image
        className="absolute w-full h-full object-cover mix-blend-overlay"
        src={trees}
        alt="Background"
      />
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="max-w-[400px] w-full p-8 bg-white/80 rounded-lg">
          <h2 className="text-4xl font-bold text-center py-8">
            Reset Password
          </h2>
          <div className="flex flex-col gap-4">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-2 border rounded"
            />
          </div>
          {message && <p className="text-green-600">{message}</p>}
          {error && <p className="text-red-600">{error}</p>}
          <button
            onClick={handlePasswordReset}
            className="w-full py-3 mt-8 bg-red-600 text-white rounded-lg">
            Send Password Reset Email
          </button>
          <div className="flex justify-end mt-4">
            <Link href="/login" className="text-blue-800 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;

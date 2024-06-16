'use client';
import React, { useState, useEffect } from 'react';
import trees from '@/app/assets/trees.jpg';
import { FcGoogle } from 'react-icons/fc';
import { IoLogoFacebook } from 'react-icons/io';
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from '@/firebase/auth';
import { useAuth } from '@/authContext';
import MyInput from '../../components/MyInput';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface Account {
  username: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const { userLoggedIn } = useAuth();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [rememberedAccounts, setRememberedAccounts] = useState<Account[]>([]);

  useEffect(() => {
    const accounts: Account[] = JSON.parse(
      localStorage.getItem('accounts') || '[]',
    );
    setRememberedAccounts(accounts);
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    const selectedAccount = rememberedAccounts.find(
      (account) => account.username === e.target.value,
    );
    if (selectedAccount) {
      setPassword(selectedAccount.password);
    } else {
      setPassword('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const signIn = async () => {
    if (!isSignedIn) {
      try {
        const resp = await doSignInWithEmailAndPassword(username, password);
        if (rememberMe) {
          const accounts: Account[] = JSON.parse(
            localStorage.getItem('accounts') || '[]',
          );
          const accountExists = accounts.find(
            (account) => account.username === username,
          );
          if (!accountExists) {
            accounts.push({ username, password });
            localStorage.setItem('accounts', JSON.stringify(accounts));
          }
        }
        router.push('/');
      } catch (error) {
        setErrorMessage('Failed to sign in. Please try again.');
      }
    }
  };

  const onGoogleSignIn = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isSignedIn) {
      setIsSignedIn(true);
      doSignInWithGoogle().catch(() => {
        setIsSignedIn(false);
      });
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
        <div className="max-w-[400px] w-full p-8 bg-white/80">
          <h2 className="text-4xl font-bold text-center py-8">GlimmerGrid</h2>
          <div className="flex justify-between py-8">
            <p className="border shadow-lg hover:shadow-xl px-6 py-2 flex items-center relative">
              <IoLogoFacebook className="mr-2" /> Facebook
            </p>
            <p
              onClick={onGoogleSignIn}
              className="border shadow-lg hover:shadow-xl px-6 py-2 flex items-center relative">
              <FcGoogle className="mr-2" /> Google
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label>Username</label>
              <input
                list="accounts"
                value={username}
                onChange={handleUsernameChange}
                className="w-full p-2 border rounded"
              />
              <datalist id="accounts">
                {rememberedAccounts.map((account) => (
                  <option key={account.username} value={account.username} />
                ))}
              </datalist>
            </div>
            <MyInput
              label="Password"
              handleChange={handlePasswordChange}
              type="password"
              value={password}
            />
          </div>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          <Link
            href="/reset-password"
            className="text-blue-500 hover:underline">
            Forgot your password?
          </Link>
          <button
            onClick={signIn}
            className="w-full py-3 mt-8 bg-green-900 text-white">
            Sign In
          </button>
          <p className="flex items-center mt-2">
            <input
              className="mr-2"
              type="checkbox"
              checked={rememberMe}
              onChange={handleRememberMeChange}
            />
            Remember Me
          </p>
          <p className="text-center mt-8">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-800 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

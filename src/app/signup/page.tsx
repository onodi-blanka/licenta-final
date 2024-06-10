'use client';
import React, { useState } from 'react';
import trees from '../assets/trees.jpg';
import { doCreateUserWithEmailAndPassword } from '@/firebase/auth';
import MyInput from '../../components/MyInput';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from "next/navigation";
interface Account {
  username: string;
  password: string;
}

export default function SignUp() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [birthdate, setBirthdate] = useState<string>('');
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthdate(e.target.value);
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };

  const signUp = async () => {
    if (!isSignedIn) {
      console.log('trying to sign up');
      const resp = await doCreateUserWithEmailAndPassword(email, password);
      if (resp.user) {
        // Sign up successful
        if (rememberMe) {
          const accounts: Account[] = JSON.parse(
            localStorage.getItem('accounts') || '[]',
          );
          accounts.push({ username: email, password });
          localStorage.setItem('accounts', JSON.stringify(accounts));
          router.push('/')
        }
      } else {
        // Handle error
        setErrorMessage('Sign up failed. Please try again.');
      }
      console.log(resp);
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
            YourCompanyName
          </h2>
          <div className="flex flex-col gap-4">
            <MyInput
              label="Email"
              handleChange={handleEmailChange}
              type="email"
              value={email}
            />
            <MyInput
              label="Password"
              handleChange={handlePasswordChange}
              type="password"
              value={password}
            />
            <MyInput
              label="Birthdate"
              handleChange={handleBirthdateChange}
              type="date"
              value={birthdate}
            />
          </div>
          {errorMessage && <p className="text-red-600">{errorMessage}</p>}
          <button
            onClick={signUp}
            className="w-full py-3 mt-8 bg-red-600 text-white rounded-lg">
            Continue
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
            Already have an account? <Link href="/login">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

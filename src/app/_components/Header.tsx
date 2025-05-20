"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { auth, db } from '@/lib/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { handleSignOut } from '@/app/_utils/handleSignOut';

const Header: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const fetchedUsername = userDoc.data().username;
                    setUsername(fetchedUsername);
                    console.log('User found in Firestore');
                } else {
                    console.error('User not found in Firestore');
                }
            } else {
                setUser(null);
                setUsername(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="relative w-full bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800 text-white shadow-2xl border-b-4 border-indigo-700 z-50">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-3xl font-black tracking-widest select-none drop-shadow-[0_2px_12px_rgba(99,102,241,0.7)] hover:scale-105 transition-transform duration-300"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-blue-200 to-white animate-gradient-x">
                            <span className="text-4xl">Batting</span> Ranking
                        </span>
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>

                    {/* Navigation Menu */}
                    <nav
                        className={`${
                            isMenuOpen ? 'block' : 'hidden'
                        } md:flex items-center space-x-10 font-semibold absolute md:static top-full left-0 w-full md:w-auto bg-gray-900 md:bg-transparent z-40`}
                    >

                        {user ? (
                            <>
                                <button
                                    onClick={handleSignOut}
                                    className="block md:inline-block px-5 py-2 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-500 shadow-md hover:from-indigo-600 hover:to-indigo-400 border border-indigo-400 text-white font-bold tracking-wide transition-all duration-300"
                                >
                                    ログアウト
                                </button>
                                <Link
                                    href="/profile"
                                    className="block md:inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-gray-800 to-indigo-900 border border-indigo-700 shadow-inner hover:shadow-indigo-400/30 transition-all duration-300"
                                >
                                    <span className="w-9 h-9 bg-indigo-600/70 border-2 border-indigo-300 rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                                        {username?.[0]?.toUpperCase()}
                                    </span>
                                    <span className="text-gray-200 font-bold">
                                        {username}さんのデータ
                                    </span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block md:inline-block px-6 py-2 rounded-full bg-gradient-to-r from-gray-700 to-indigo-800 border border-indigo-500 shadow hover:bg-indigo-700 hover:text-indigo-200 transition-all duration-300"
                                >
                                    ログイン
                                </Link>
                                <Link
                                    href="/register"
                                    className="block md:inline-block px-6 py-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 text-gray-900 font-bold border border-indigo-200 shadow hover:from-indigo-300 hover:to-indigo-500 hover:text-white transition-all duration-300"
                                >
                                    新規登録
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
            {/* Decorative bottom bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-700 opacity-70 blur-[2px]" />
        </header>
    );
};

export default Header;
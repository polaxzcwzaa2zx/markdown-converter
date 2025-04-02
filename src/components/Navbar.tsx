'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';

interface NavbarProps {
  onLanguageChange: (lang: 'en' | 'zh') => void;
  currentLang: 'en' | 'zh';
}

export default function Navbar({ onLanguageChange, currentLang }: NavbarProps) {
  const { theme, setTheme } = useTheme();
  
  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📄</span>
            <span className="font-bold text-xl text-gray-800 dark:text-white">MdConverter</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLanguageChange(currentLang === 'en' ? 'zh' : 'en')}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {currentLang === 'en' ? '中文' : 'EN'}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 
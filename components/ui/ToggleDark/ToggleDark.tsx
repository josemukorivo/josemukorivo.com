import { useEffect, useState } from 'react';
import { IoIosMenu } from 'react-icons/io';

export const ToggleDark = () => {
  const getTheme = (): 'light' | 'dark' => {
    if (
      window.localStorage.theme === 'dark' ||
      (!('theme' in window.localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      return 'dark';
    } else {
      return 'light';
    }
  };

  const [theme, setTheme] = useState('');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      window.localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    setTheme(getTheme());
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  return (
    <button
      className='rounded-lg p-2 bg-slate-500 bg-opacity-20 dark:bg-slate-800 bg-transparent dark:text-slate-100 ring-0 hover:ring-0'
      onClick={() => toggleTheme()}
    >
      {theme === 'light' && <IoIosMenu className='h-[30px] w-auto' />}
      {theme === 'dark' && <IoIosMenu className='h-[30px] w-auto' />}
    </button>
  );
};

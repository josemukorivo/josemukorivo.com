import { useEffect, useState } from 'react';
import { BiSun, BiMoon } from 'react-icons/bi';

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
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className='transform rounded-full bg-slate-50 p-2 transition duration-500 ease-in-out hover:rotate-[360deg] hover:scale-110 dark:bg-slate-800'
      onClick={() => toggleTheme()}
    >
      {theme === 'light' && <BiMoon className='h-4 w-auto' />}
      {theme === 'dark' && <BiSun className='h-4 w-auto' />}
    </button>
  );
};

import { useEffect, useState } from 'react';

export const useTheme = () => {
  const getTheme = (): 'light' | 'dark' => {
    // You can respect the sytem preferences by adding `matchMedia` as OR condition
    // (!('theme' in window.localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches))
    if (window.localStorage.theme === 'dark') {
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

  return { theme, toggleTheme };
};

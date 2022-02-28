import { useEffect, useState } from 'react';

const initialState = { monochrome: false };

function reducer(state, action) {
  switch (action.type) {
    case 'monochrome':
      if (action.payload) {
        document.body.classList.add('grayscale');
      } else {
        document.body.classList.remove('grayscale');
      }
      return { monochrome: action.payload };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

export const useAccessibility = () => {
  const getTheme = () => {
    if (window.localStorage.accessibility) {
      return window.localStorage.accessibility;
    } else {
      return 'dark';
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

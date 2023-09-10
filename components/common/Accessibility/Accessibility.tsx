import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Box } from '@components/ui';
import { useTheme } from 'hooks';
import { Button } from './Button';
import { Modal } from './Modal/Modal';

export const Accessibility = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleModal = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);

    const timeOut = setTimeout(() => {
      setIsOpen(true);
    }, 4000);

    return () => {
      window.removeEventListener('keydown', handleEsc);
      clearTimeout(timeOut);
    };
  }, []);

  return (
    <Box className='fixed bottom-20 right-4 z-30 md:right-8'>
      <AnimatePresence>
        {isOpen && (
          <Modal
            onClose={toggleModal}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </AnimatePresence>
      <Button onClick={toggleModal} />
    </Box>
  );
};

import { useState } from 'react';

import { Box } from '@components/ui';
import { Modal } from './Modal/Modal';
import { Button } from './Button';
import { useTheme } from 'hooks';
import { AnimatePresence } from 'framer-motion';

export const Accessibility = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleModal = () => setIsOpen(!isOpen);

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

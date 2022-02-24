import { VscMenu } from 'react-icons/vsc';

import { ToggleDark, Box } from '@components/ui';

export const MenuButton = ({ onOpen }) => {
  return (
    <Box className='flex items-center gap-5'>
      <ToggleDark />
      <button
        aria-label='Menu button'
        className='transform hover:scale-90'
        onClick={onOpen}
      >
        <VscMenu className='h-6 w-auto' />
      </button>
    </Box>
  );
};

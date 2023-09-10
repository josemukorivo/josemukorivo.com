import { VscMenu } from 'react-icons/vsc';

export const MenuButton = ({ onOpen }) => {
  return (
    <button
      aria-label='Menu button'
      className='transform hover:scale-95 md:text-white'
      onClick={onOpen}
    >
      <VscMenu className='h-7 w-auto' />
    </button>
  );
};

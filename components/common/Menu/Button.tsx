import { VscMenu } from 'react-icons/vsc';

export const MenuButton = ({ onOpen }) => {
  return (
    <button
      aria-label='Menu button'
      className='transform hover:scale-90'
      onClick={onOpen}
    >
      <VscMenu className='h-6 w-auto' />
    </button>
  );
};

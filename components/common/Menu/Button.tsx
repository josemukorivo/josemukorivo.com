import { VscMenu } from 'react-icons/vsc';

export const MenuButton = ({ onOpen, className = '' }) => {
  return (
    <button
      aria-label='Menu button'
      className={`transform hover:scale-95 ${className}`}
      onClick={onOpen}
    >
      <VscMenu className='h-7 w-auto' />
    </button>
  );
};

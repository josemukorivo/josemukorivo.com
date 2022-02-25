import { motion } from 'framer-motion';
import { VscChromeClose } from 'react-icons/vsc';

export const CloseButton = ({ onClose }) => {
  return (
    <motion.button
      className='group fixed right-8 top-7 flex items-center gap-2 md:right-12'
      onClick={onClose}
      initial={{ y: -60, opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <VscChromeClose className='h-6 w-auto transform transition duration-300 ease-in-out group-hover:rotate-90 group-hover:text-rose-500' />
      <span className='font-heading text-base uppercase tracking-widest group-hover:scale-95'>
        Close
      </span>
    </motion.button>
  );
};

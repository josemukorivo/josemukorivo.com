import { MotionConfig, motion } from 'framer-motion';
import { FaUniversalAccess } from 'react-icons/fa';

export const Button = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    initial={{ y: -40, opacity: 0, scale: 1.5 }}
    transition={{ duration: 1, delay: 2.2 }}
    animate={{ y: 0, opacity: 1, scale: 1 }}
    aria-label='Accessibility button'
    title='Accessibility button'
    className='absolute right-0 rounded-full bg-rose-500 p-2 text-white transition duration-500 ease-in-out hover:rotate-[360deg] hover:scale-110'
  >
    <FaUniversalAccess className='h-8 w-auto' />
  </motion.button>
);

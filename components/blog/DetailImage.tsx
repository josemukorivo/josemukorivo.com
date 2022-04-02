import Image from 'next/image';
import { Box } from '@components/ui';
import { motion } from 'framer-motion';

export const DetailImage = ({ coverImage }) => {
  return (
    <Box className='hidden h-screen overflow-hidden md:block'>
      <motion.div
        initial={{ y: -20, scale: 1.2, opacity: 0.8 }}
        transition={{ duration: 1.3 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        className='relative -z-[2] h-full blur-[2px]'
      >
        <Image
          src={coverImage}
          alt=''
          quality={100}
          objectFit='cover'
          layout='fill'
          className='bg-slate-50 dark:bg-slate-800'
          blurDataURL='/images/blog-placeholder.png'
          placeholder='blur'
        />
      </motion.div>
    </Box>
  );
};

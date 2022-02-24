import Image from 'next/image';
import { Box } from '@components/ui';

export const DetailImage = ({ coverImage }) => {
  return (
    <Box className='hidden h-screen overflow-hidden md:block'>
      <Box className='relative -z-[2] h-full blur-[2px]'>
        <Image
          src={coverImage}
          alt=''
          quality={100}
          objectFit='cover'
          layout='fill'
          blurDataURL='/images/blog-placeholder.png'
          placeholder='blur'
          className=''
        />
      </Box>
    </Box>
  );
};

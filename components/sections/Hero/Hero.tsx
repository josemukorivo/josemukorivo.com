import { motion } from 'framer-motion';
import { AiOutlineArrowDown } from 'react-icons/ai';

import { Text, Box, Container, Link, Button } from '@components/ui';
import Image from 'next/image';

export const Hero = () => {
  return (
    <Box className='mb-10 grid md:mb-40 md:h-screen md:grid-cols-2' id='top'>
      <Container className='md:order-0 order-1 flex w-full flex-col justify-between pb-12 pt-5'>
        <Box className='mb-10' />
        <Box className='order-1 mt-10 max-w-xl md:order-2'>
          <Text as='h1' className='mb-5'>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 1 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Hi 👋🏼, I’m Joseph. <br /> Writer, Software Engineer, DevOps
              Enthusiat.
            </motion.span>
          </Text>
          <Text className='mb-6 2xl:mb-10'>
            <motion.span
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <code className='text-base font-medium dark:text-slate-100 2xl:text-lg'>
                &lt;Welcome😎/&gt;
              </code>
              , nice to meet you. I occasionaly write about Software Development
              and Cloud Native Technologies here. I enjoy turning business
              problems into digital solutions through{' '}
              <code className='text-base 2xl:text-lg'>{'<code/>'}</code>.
            </motion.span>
          </Text>
          <Button
            variant='primary'
            size='lg'
            href='/blog'
            className='font-heading mr-3 text-sm uppercase'
          >
            Read my blog
          </Button>
          <Button
            variant='secondary'
            size='lg'
            target='_blank'
            href='https://docs.google.com/document/d/16-sqqDzL3SR1vomlTW6gKOKIqJ7xd_MgfJXrDLkqbnU/edit'
            className='font-heading mr-3 text-sm uppercase'
          >
            View my resume
          </Button>
        </Box>
        <Box className='order-2 hidden md:order-3 md:block'>
          <Link
            className='font-heading flex gap-1 text-sm uppercase text-slate-900 dark:text-slate-200'
            href='#latest'
          >
            <AiOutlineArrowDown className='h-[21px] w-auto' /> scroll down
          </Link>
        </Box>
      </Container>
      <Box className='order-0 relative flex h-[73vh] max-w-xl justify-end bg-slate-800 pt-3 dark:bg-black md:left-4 md:order-1 md:h-full md:bg-transparent md:dark:bg-transparent'>
        <Image
          src='/images/jose.png'
          layout='fill'
          objectFit='cover'
          priority
          quality={100}
          alt='Joseph Mukorivo'
        />
      </Box>
    </Box>
  );
};

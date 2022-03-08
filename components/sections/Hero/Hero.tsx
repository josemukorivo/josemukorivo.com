import Image from 'next/image';
import { motion } from 'framer-motion';
import { AiOutlineArrowDown } from 'react-icons/ai';

import { Text, Box, Container, Link, Button } from '@components/ui';

export const Hero = () => {
  return (
    <Box className='mb-10 grid md:mb-40 md:h-screen md:grid-cols-2' id='top'>
      <Container className='md:order-0 order-1 flex w-full flex-col justify-between pb-12 pt-5'>
        <Box className='md:mb-10' />
        <Box className='order-1 mt-5 max-w-xl md:order-2 md:mt-10'>
          <Text as='h1' className='mb-5' fontSize='5xl'>
            <motion.span
              className='block'
              initial={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.8 }}
              whileInView={{ y: 0, opacity: 1 }}
            >
              Hi 👋🏼, I’m Joseph. <br /> Writer, Software Engineer, DevOps
              Enthusiat.
            </motion.span>
          </Text>
          <Text className='mb-6 2xl:mb-10'>
            <motion.span
              className='block'
              initial={{ y: 20, opacity: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              whileInView={{ y: 0, opacity: 1 }}
            >
              <code className='text-base font-medium dark:text-slate-100 2xl:text-lg'>
                &lt;Welcome😎/&gt;
              </code>
              , nice to meet you. This is my personal space on the internet
              where I get to try out new technologies and occasionaly write
              about Software Development, Cloud Native Technologies and tech in
              general.
            </motion.span>
          </Text>
          <Box className='flex'>
            <motion.div
              initial={{ x: -10 }}
              transition={{ duration: 1, delay: 0.4 }}
              whileInView={{ x: 0 }}
            >
              <Button
                variant='primary'
                size='lg'
                href='/blog'
                className='font-heading mr-3 text-sm uppercase'
              >
                Read my blog
              </Button>
            </motion.div>
            <motion.div
              initial={{ x: 10 }}
              transition={{ duration: 1, delay: 0.4 }}
              whileInView={{ x: 0 }}
            >
              <Button
                variant='secondary'
                size='lg'
                target='_blank'
                href='https://docs.google.com/document/d/16-sqqDzL3SR1vomlTW6gKOKIqJ7xd_MgfJXrDLkqbnU/edit'
                className='font-heading mr-3 text-sm uppercase'
              >
                View my resume
              </Button>
            </motion.div>
          </Box>
        </Box>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          whileInView={{ y: 0, opacity: 1 }}
          className='order-2 hidden md:order-3 md:block'
        >
          <Link
            className='font-heading flex gap-1 text-sm uppercase text-slate-900 hover:text-rose-500 dark:text-slate-200 dark:hover:text-rose-500'
            href='#latest'
          >
            <AiOutlineArrowDown className='h-[21px] w-auto' /> scroll down
          </Link>
        </motion.div>
      </Container>

      <motion.div
        initial={{ opacity: 0.8 }}
        transition={{ duration: 0.6 }}
        animate={{ opacity: 1 }}
        className='relative mt-[64px] h-[70vh] md:hidden'
      >
        <Image
          src='/images/jose.jpg'
          layout='fill'
          objectFit='cover'
          objectPosition='top right'
          priority
          quality={100}
          blurDataURL='/images/jose-placeholder.png'
          placeholder='blur'
          alt='Joseph Mukorivo'
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0.8 }}
        transition={{ duration: 0.6 }}
        animate={{ opacity: 1 }}
        className='relative left-4 order-1 mt-0 hidden h-full max-w-xl justify-end pt-3 md:flex'
      >
        <Image
          src='/images/jose.png'
          layout='fill'
          objectFit='cover'
          priority
          quality={100}
          blurDataURL='/images/jose-placeholder.png'
          placeholder='blur'
          alt='Joseph Mukorivo'
        />
      </motion.div>
    </Box>
  );
};

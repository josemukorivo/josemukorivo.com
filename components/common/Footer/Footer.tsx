import { BsArrowUpCircle } from 'react-icons/bs';

import { Container, Box, Text, Link } from '@components/ui';
import { Subscribe, Copyright } from '@components/common';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer>
      <Container className='relative mb-10 grid-cols-5 gap-20 md:grid 2xl:px-16'>
        <Box className='col-span-3 max-w-lg'>
          <Text
            as='h4'
            className='font-heading mb-4 text-xl font-medium uppercase'
          >
            <motion.span
              className='block'
              initial={{ x: -40 }}
              transition={{ duration: 0.6 }}
              whileInView={{ x: 0 }}
            >
              Joseph Mukorivo
            </motion.span>
          </Text>
          <Text>
            <motion.span
              className='block'
              initial={{ x: -40 }}
              transition={{ duration: 0.8 }}
              whileInView={{ x: 0 }}
            >
              Software engineer from Harare, Zimbabwe who is trying to make the
              world a better place one{' '}
              <code className='text-sm font-bold dark:font-medium dark:text-slate-300 2xl:text-lg'>
                {'<commit/>'}
              </code>{' '}
              at a time 😎.
            </motion.span>
          </Text>
          <Subscribe />
        </Box>
        <Box className='col-span-2 hidden md:block'>
          <Text as='h6' className='font-heading mb-4 font-medium uppercase'>
            <motion.span
              className='block'
              initial={{ x: 40 }}
              transition={{ duration: 0.8 }}
              whileInView={{ x: 0 }}
            >
              Quick Links
            </motion.span>
          </Text>
          <motion.span
            className='block'
            initial={{ x: 40 }}
            transition={{ duration: 0.6 }}
            whileInView={{ x: 0 }}
          >
            <Link
              href='mailto:hello@josemukorivo.dev'
              className='mb-3 block text-base font-medium hover:text-rose-500 dark:hover:text-rose-500'
            >
              <code>{'<Email me/>'}</code>
            </Link>
            <Link
              href='/blog'
              className='mb-3 block text-base font-medium hover:text-rose-500 dark:hover:text-rose-500'
            >
              <code>{'<Read the Blog/>'}</code>
            </Link>
            <Link
              href='/#about'
              className='mb-3 block text-base font-medium hover:text-rose-500 dark:hover:text-rose-500'
            >
              <code>{'<About Joseph/>'}</code>
            </Link>
          </motion.span>
        </Box>

        <Link
          href='#top'
          className='group absolute bottom-0 right-10 hidden items-center gap-2 text-sm font-medium uppercase text-rose-500 transition duration-300 ease-in-out hover:text-rose-600 dark:text-rose-500 md:flex'
        >
          Back to top
          <BsArrowUpCircle className='relative -top-[2px] h-5 w-5 transform transition duration-300 ease-in-out group-hover:-translate-y-1' />
        </Link>
      </Container>

      <Copyright />
    </footer>
  );
};

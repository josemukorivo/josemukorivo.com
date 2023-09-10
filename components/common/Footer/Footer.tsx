import { BsArrowUpCircle } from 'react-icons/bs';

import { Copyright, Subscribe } from '@components/common';
import { Box, Container, Link, Text } from '@components/ui';
import { motion } from 'framer-motion';

export const Footer = () => {
  return (
    <footer id='subscribe'>
      <Container className='relative mb-10 grid-cols-5 gap-20 md:grid'>
        <Box className='col-span-3 max-w-lg'>
          <Text
            as='h4'
            casing='uppercase'
            fontWeight='medium'
            fontSize='xl'
            className='font-heading mb-4'
          >
            <motion.span
              className='block'
              initial={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              whileInView={{ opacity: 1 }}
            >
              Joseph Mukorivo
            </motion.span>
          </Text>
          <Text className='mb-6'>
            <motion.span
              className='block'
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              whileInView={{ opacity: 1 }}
            >
              Software engineer from Harare, Zimbabwe who is trying to make the
              world a better place one{' '}
              <code className='font-bold dark:font-medium dark:text-slate-300 2xl:text-xl'>
                {'<commit/>'}
              </code>{' '}
              at a time 😎.
            </motion.span>
          </Text>
          <Subscribe />
        </Box>
        <Box className='col-span-2 hidden md:block'>
          <Text
            as='h6'
            casing='uppercase'
            fontWeight='medium'
            className='font-heading mb-5'
          >
            <motion.span
              className='block'
              initial={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              whileInView={{ opacity: 1 }}
            >
              Quick Links
            </motion.span>
          </Text>
          <motion.span
            className='block'
            initial={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            whileInView={{ opacity: 1 }}
          >
            <Link
              href='mailto:hello@josemukorivo.com'
              className='mb-4 block text-sm font-heading uppercase tracking-widest hover:text-rose-500 dark:hover:text-rose-500'
            >
              {'<Email me/>'}
            </Link>
            <Link
              href='/blog'
              className='mb-4 block text-sm font-heading uppercase tracking-widest hover:text-rose-500 dark:hover:text-rose-500'
            >
              {'<Read the Blog/>'}
            </Link>
            <Link
              href='/#about'
              className='mb-4 block text-sm font-heading uppercase tracking-widest hover:text-rose-500 dark:hover:text-rose-500'
            >
              {'<About Joseph/>'}
            </Link>
          </motion.span>
        </Box>

        <Link
          href='#top'
          className='group absolute bottom-0 right-10 hidden items-center gap-2 text-sm font-medium uppercase text-rose-500 font-heading transition duration-300 ease-in-out hover:text-rose-600 dark:text-rose-500 md:flex'
        >
          Back to top
          <BsArrowUpCircle
            strokeWidth={0.3}
            className='h-5 w-auto transform transition duration-300 ease-in-out group-hover:-translate-y-[2px]'
          />
        </Link>
      </Container>

      <Copyright />
    </footer>
  );
};

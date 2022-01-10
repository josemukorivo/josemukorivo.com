import { AiOutlineArrowUp } from 'react-icons/ai';

import { Container, Box, Text, Link } from '@components/ui';
import { Subscribe } from '@components/common';

const Copyright = () => (
  <Container className='border-t border-slate-300 dark:border-slate-800 pt-5 flex flex-col md:flex-row justify-between'>
    <Text className='text-sm md:text-base'>
      Copyright © {new Date().getFullYear()} | All rights reserved.
    </Text>
    <Text className='text-sm md:text-base'>
      Made with ❤️ in Zimbabwe by{' '}
      <Link
        href='https://josemukorivo.dev'
        className='font-medium text-rose-500 hover:text-rose-600'
      >
        Joseph Mukorivo
      </Link>
      .
    </Text>
  </Container>
);

export const Footer = () => {
  return (
    <footer>
      <Container className='relative md:grid grid-cols-5 gap-20 mb-10 2xl:px-16'>
        <Box className='col-span-3 max-w-lg'>
          <Text as='h4' className='font-heading uppercase'>
            Joseph Mukorivo
          </Text>
          <Text>
            Software engineer from Harare, Zimbabwe who is trying to make the
            world a better place one{' '}
            <code className='text-sm 2xl:text-lg font-bold dark:font-medium dark:text-slate-300'>
              {'<commit/>'}
            </code>{' '}
            at a time 😎.
          </Text>
          <Subscribe />
        </Box>
        <Box className='hidden md:block col-span-2'>
          <Text as='h6' className='font-heading uppercase'>
            Quick Links
          </Text>
          <Link href='#top' className='block mb-3 font-medium 2xl:text-lg'>
            <code>{'<Email me/>'}</code>
          </Link>
          <Link href='#top' className='block mb-3 font-medium 2xl:text-lg'>
            <code>{'<Read the Blog/>'}</code>
          </Link>
          <Link href='#top' className='block mb-3 font-medium 2xl:text-lg'>
            <code>{'<About Joseph/>'}</code>
          </Link>
        </Box>

        <Link
          href='#top'
          className='absolute 2xl:text-lg hidden transition duration-300 ease-in-out group bottom-0 right-10 md:flex font-medium gap-2 items-center text-rose-500 hover:text-rose-600'
        >
          Scroll to top
          <AiOutlineArrowUp className='w-5 h-5 relative -top-[2px] transition duration-300 ease-in-out transform group-hover:-translate-y-1' />
        </Link>
      </Container>

      <Copyright />
    </footer>
  );
};

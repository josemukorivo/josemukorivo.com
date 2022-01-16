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
        className='font-bold text-rose-500 dark:text-rose-500 hover:text-rose-600'
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
          <Text as='h4' className='font-heading uppercase font-medium'>
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
          <Text as='h6' className='font-heading font-medium uppercase'>
            Quick Links
          </Text>
          <Link
            href='mailto:hello@josemukorivo.dev'
            className='block mb-3 font-medium text-base'
          >
            <code>{'<Email me/>'}</code>
          </Link>
          <Link href='/blog' className='block mb-3 font-medium text-base'>
            <code>{'<Read the Blog/>'}</code>
          </Link>
          <Link href='#about' className='block mb-3 font-medium text-base'>
            <code>{'<About Joseph/>'}</code>
          </Link>
        </Box>

        <Link
          href='#top'
          className='absolute text-base hidden transition duration-300 ease-in-out group bottom-0 right-10 md:flex font-bold gap-2 items-center dark:text-rose-500 text-rose-500 hover:text-rose-600'
        >
          Back to top
          <AiOutlineArrowUp className='w-5 h-5 relative -top-[2px] transition duration-300 ease-in-out transform group-hover:-translate-y-1' />
        </Link>
      </Container>

      <Copyright />
    </footer>
  );
};

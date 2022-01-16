import Image from 'next/image';
import { Text, Box, Container, Link } from '@components/ui';

export const About = () => {
  return (
    <Container
      id='about'
      className='grid md:grid-cols-5 gap-10 mb-20 md:mb-40 max-w-[1180px] 2xl:max-w-7xl'
    >
      <Box className='md:col-span-3'>
        <Text as='h2' className='font-medium'>
          Get to know me
        </Text>
        <Text className='md:columns-2 gap-5 2xl:gap-10'>
          Hello there, my name is Joseph, a passionate Software Developer from
          Harare, Zimbabwe. I currently work as a{' '}
          <b>QA Engineer/Bot Developer</b> at{' '}
          <Link
            className='text-rose-500 dark:text-rose-500 font-bold'
            target='_blank'
            href='https://vocinity.com'
          >
            Vocinty
          </Link>
          . I&lsquo;m obsessed with making software that end-user centric by
          applying Agile methodologies. I&lsquo;ve worked for a variety of
          companies over the years, ranging from startups to large corporations,
          such as{' '}
          <Link
            className='text-rose-500 dark:text-rose-500 font-bold'
            target='_blank'
            href='https://rbz.co.zw'
          >
            The Reserve Bank of Zimbabwe
          </Link>
          ,{' '}
          <Link
            className='text-rose-500 dark:text-rose-500 font-bold'
            target='_blank'
            href='https://sivioinstitute.org'
          >
            The Sivio Institute (Zimbabwe)
          </Link>
          , and{' '}
          <Link
            className='text-rose-500 dark:text-rose-500 font-bold'
            target='_blank'
            href='https://vocinity.com'
          >
            Vocinity (USA)
          </Link>
          .
        </Text>
      </Box>
      <Box className='relative md:pt-10 md:col-span-2 h-64 md:h-[360px] 2xl:h-[420px]'>
        <Image
          src='/images/me.jpeg'
          layout='fill'
          alt='Joseph'
          quality={100}
          objectFit='cover'
        />
      </Box>
    </Container>
  );
};

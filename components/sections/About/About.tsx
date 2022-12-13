import Image from 'next/image';
import { Text, Box, Container, Link } from '@components/ui';
import { motion } from 'framer-motion';
import { Button } from '@components/ui';

export const About = () => {
  return (
    <Container id='about' className='mb-20 grid gap-10 md:mb-40 md:grid-cols-5'>
      <Box className='md:col-span-3'>
        <Text as='h2' className='mb-5' fontSize='4xl'>
          <motion.span
            className='block'
            initial={{ x: -10 }}
            transition={{ duration: 0.8 }}
            whileInView={{ x: 0 }}
          >
            Get to know me
          </motion.span>
        </Text>
        <Text className='gap-5 md:columns-2 2xl:gap-10'>
          Hello there, my name is Joseph,{' '}
          <span className='font-medium'>Founder & CTO</span> of{' '}
          <Link
            className='font-medium text-rose-500 dark:text-rose-500'
            target='_blank'
            href='https://complexus.tech'
          >
            Complexus Technologies
          </Link>{' '}
          and a passionate Software Developer from Harare, Zimbabwe. I currently
          work as a{' '}
          <span className='font-medium'>QA Engineer/Bot Developer</span> at{' '}
          <Link
            className='font-medium text-rose-500 dark:text-rose-500'
            target='_blank'
            href='https://vocinity.com'
          >
            Vocinty
          </Link>
          . I&lsquo;m obsessed with making software that is end-user centric by
          applying Agile methodologies. I&lsquo;ve worked for a variety of
          companies over the years, ranging from startups to large corporations,
          such as{' '}
          <Link
            className='font-medium text-rose-500 dark:text-rose-500'
            target='_blank'
            href='https://rbz.co.zw'
          >
            The Reserve Bank of Zimbabwe
          </Link>
          ,{' '}
          <Link
            className='font-medium text-rose-500 dark:text-rose-500'
            target='_blank'
            href='https://sivioinstitute.org'
          >
            The Sivio Institute (Zimbabwe)
          </Link>
          , and{' '}
          <Link
            className='font-medium text-rose-500 dark:text-rose-500'
            target='_blank'
            href='https://vocinity.com'
          >
            Vocinity (USA)
          </Link>
          .
        </Text>
        <Button
          variant='primary'
          size='lg'
          target='_blank'
          href='https://docs.google.com/document/d/16-sqqDzL3SR1vomlTW6gKOKIqJ7xd_MgfJXrDLkqbnU/edit'
          className='font-heading mr-3 mt-8 text-sm uppercase'
        >
          See my resume
        </Button>
      </Box>
      <motion.div
        initial={{ translateX: 30 }}
        transition={{ duration: 1 }}
        whileInView={{ translateX: 0 }}
        className='relative h-64 md:col-span-2 md:h-[360px] md:pt-10 2xl:h-[420px]'
      >
        <Image
          src='/images/me.jpeg'
          layout='fill'
          alt='Joseph'
          quality={100}
          objectFit='cover'
        />
      </motion.div>
    </Container>
  );
};

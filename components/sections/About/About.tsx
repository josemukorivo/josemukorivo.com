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
          Hello there, I&lsquo;m Joseph, a Software Developer from Harare,
          Zimbabwe and <span className='font-medium'>Founder & CTO</span> of{' '}
          <Link
            className='font-medium text-rose-500 dark:text-rose-500'
            target='_blank'
            href='https://complexus.tech'
          >
            Complexus Technologies
          </Link>{' '}
          . My passion lies in creating end-user centric software using Agile
          methodologies. Over the years, I&lsquo;ve had the privilege of working
          with various companies ranging from startups to large corporations
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
            Vocinty(USA)
          </Link>
          . I&lsquo;ve recently moved to Nairobi, Kenya, where I&lsquo;m
          currently working as a Software Engineer at{' '}
          <Link
            className='font-medium text-rose-500 dark:text-rose-500'
            target='_blank'
            href='https://fin.africa'
          >
            Fin.
          </Link>
        </Text>
        <Button
          variant='primary'
          size='lg'
          target='_blank'
          href='https://docs.google.com/document/d/16-sqqDzL3SR1vomlTW6gKOKIqJ7xd_MgfJXrDLkqbnU/edit'
          className='mr-3 mt-8 font-heading text-sm uppercase'
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

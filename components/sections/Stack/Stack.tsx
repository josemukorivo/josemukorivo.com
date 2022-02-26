import Image from 'next/image';
import { FC } from 'react';

import { Box, Container, Link, Marquee, Text } from '@components/ui';
import s from './Stack.module.scss';
import { motion } from 'framer-motion';

const Stack: FC<{ src: string }> = ({ src }) => {
  return (
    <Box className={s.stack}>
      <img
        src={src}
        alt=''
        className='mr-2 block h-12 w-auto md:mr-10 md:h-12 2xl:mr-12 2xl:h-16'
      />
    </Box>
  );
};

export const TechStack = () => {
  const techStack = [
    '/images/stack/next.svg',
    '/images/stack/kubernetes-icon.svg',
    '/images/stack/golang-official.svg',
    '/images/stack/styled-components.svg',
    '/images/stack/reactjs-icon.svg',
    '/images/stack/strapi.svg',
    '/images/stack/highcharts.svg',
    '/images/stack/tailwindcss-icon.svg',
    '/images/stack/javascript.svg',
    '/images/stack/docker-icon.svg',
    '/images/stack/figma-icon.svg',
    '/images/stack/typescriptlang-icon.svg',
    '/images/stack/google_cloud-icon.svg',
    '/images/stack/python-icon.svg',
  ];

  return (
    <Container full className={s.root}>
      <Container className='2xl:px-16'>
        <Box className='flex items-center justify-between'>
          <Text as='h2' className='mb-4 font-medium'>
            <motion.span
              className='block'
              initial={{ x: -40 }}
              transition={{ duration: 1 }}
              whileInView={{ x: 0 }}
            >
              Tech Stack
            </motion.span>
          </Text>
          <Link
            href='https://docs.google.com/document/d/16-sqqDzL3SR1vomlTW6gKOKIqJ7xd_MgfJXrDLkqbnU/'
            target='_blank'
            className='font-heading mb-6 text-sm font-medium uppercase md:mb-0'
          >
            <motion.span
              className='block'
              initial={{ x: 40 }}
              transition={{ duration: 1 }}
              whileInView={{ x: 0 }}
            >
              See my resume
            </motion.span>
          </Link>
        </Box>
        <Text className='max-w-lg'>
          <motion.span
            className='block'
            initial={{ x: -40 }}
            transition={{ duration: 0.6 }}
            whileInView={{ x: 0 }}
          >
            Over the last couple of years I have worked on a variety of projects
            and have also used a variety of technologies, below are some of the
            technologies I have used.
          </motion.span>
        </Text>
      </Container>

      <Box className={s.stackContainer}>
        <Marquee className='py-4'>
          {techStack.map((icon) => (
            <Stack key={icon} src={icon} />
          ))}
        </Marquee>
      </Box>
    </Container>
  );
};

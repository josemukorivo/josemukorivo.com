import Image from 'next/image';
import { FC } from 'react';

import { Box, Container, Link, Marquee, Text } from '@components/ui';
import s from './Stack.module.scss';

const Stack: FC<{ src: string; href: string }> = ({ src, href }) => {
  return (
    <Link target='_blank' href={href} className={s.stack}>
      <img
        src={src}
        alt=''
        className='h-12 md:h-12 2xl:h-16 w-auto block mr-2 md:mr-10 2xl:mr-12'
      />
    </Link>
  );
};

export const TechStack = () => {
  const techStack = [
    { href: 'htts://next.org', icon: '/images/stack/next.svg' },
    { href: '', icon: '/images/stack/kubernetes-icon.svg' },
    { href: '', icon: '/images/stack/golang-official.svg' },
    { href: '', icon: '/images/stack/styled-components.svg' },
    { href: '', icon: '/images/stack/reactjs-icon.svg' },
    { href: '', icon: '/images/stack/strapi.svg' },
    { href: '', icon: '/images/stack/highcharts.svg' },
    { href: '', icon: '/images/stack/tailwindcss-icon.svg' },
    { href: '', icon: '/images/stack/javascript.svg' },
    { href: '', icon: '/images/stack/docker-icon.svg' },
    { href: '', icon: '/images/stack/figma-icon.svg' },
    { href: '', icon: '/images/stack/typescriptlang-icon.svg' },
    { href: '', icon: '/images/stack/google_cloud-icon.svg' },
    { href: '', icon: '/images/stack/python-icon.svg' },
  ];

  return (
    <Container full className={s.root}>
      <Container className='2xl:px-16'>
        <Box className='flex justify-between items-center'>
          <Text as='h2' className='font-medium'>
            Tech Stack
          </Text>
          <Link
            href='https://docs.google.com/document/d/16-sqqDzL3SR1vomlTW6gKOKIqJ7xd_MgfJXrDLkqbnU/'
            target='_blank'
            className='font-heading uppercase text-sm font-medium'
          >
            See my resume
          </Link>
        </Box>
        <Text className='max-w-lg'>
          Over the last couple of years I have worked on a variety of projects
          and have also used a variety of technologies, below are some of the
          technologies I have used.
        </Text>
      </Container>

      <Box className={s.stackContainer}>
        <Marquee className='py-4'>
          {techStack.map(({ href, icon }) => (
            <Stack key={href} src={icon} href={href} />
          ))}
        </Marquee>
      </Box>
    </Container>
  );
};

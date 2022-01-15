import Image from 'next/image';
import { Text, Box, Container } from '@components/ui';

export const About = () => {
  return (
    <Container className='grid md:grid-cols-5 gap-10 mb-20 md:mb-40 max-w-[1180px] 2xl:max-w-7xl'>
      <Box className='md:col-span-3'>
        <Text as='h2' className='font-medium'>
          Get to know me
        </Text>
        <Text className='md:columns-2 gap-5 2xl:gap-10'>
          I began programming in 2016, when I started my Bachelors degree in
          Information Technology. I spend the majority of my time learning about
          new technologies, coding, and occasionally blogging. After one of my
          articles received a lot of attention from the development community, I
          was given a badge for Author of the week on dev.to. I currently work
          as a QA Engineer/Bot Developer at Vocinity a US company that provides
          a platform for developers to build bots for their teams.
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

import { Box, Container, Text } from '@components/ui';
import { BlogMenu } from './menu';

export const BlogHero = () => {
  return (
    <>
      <BlogMenu />
      <Container>
        <Box className='pb-4 mt-4 md:mt-20 md:text-center'>
          <Text as='h2' className='font-medium'>
            My blog
          </Text>
          <Text className='text-base md:text-lg'>
            Get the latest news from myself and what I&lsquo;m currently working
            on.
          </Text>
        </Box>
      </Container>
    </>
  );
};

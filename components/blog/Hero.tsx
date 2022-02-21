import { Box, Container, Text } from '@components/ui';

export const BlogHero = () => {
  return (
    <Container>
      <Box className='pb-4 mt-4 md:mt-20'>
        <Text as='h2' className='font-medium mb-4 md:mb-10'>
          Blog
        </Text>
      </Box>
    </Container>
  );
};

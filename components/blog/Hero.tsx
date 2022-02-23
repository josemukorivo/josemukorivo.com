import { Box, Container, Text } from '@components/ui';

export const BlogHero = () => {
  return (
    <Container>
      <Box className='mt-4 pb-4 md:mt-24'>
        <Text as='h2' className='mb-4 font-medium md:mb-6'>
          Blog
        </Text>
      </Box>
    </Container>
  );
};

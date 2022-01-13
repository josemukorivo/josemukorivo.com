import { Box, Text } from '@components/ui';

export const BlogHero = () => {
  return (
    <Box className='py-16 text-center'>
      <Text as='h2'>My blog</Text>
      <Text className='text-xl'>
        Get the latest news from myself and what I&lsquo;m currently working on.
      </Text>
    </Box>
  );
};

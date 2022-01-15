import { Box, Text } from '@components/ui';

export const BlogHero = () => {
  return (
    <Box className='py-5 text-center'>
      <Text as='h2' className='font-medium'>
        My blog
      </Text>
      <Text className='text-base md:text-lg'>
        Get the latest news from myself and what I&lsquo;m currently working on.
      </Text>
    </Box>
  );
};

import { Box, Text } from '@components/ui';

export const BlogHero = () => {
  return (
    <Box className='py-16 text-center'>
      <Text as='h2'>Blog</Text>
      <Text className='text-xl'>
        All the latest Tailwind CSS news, straight from the team.
      </Text>
    </Box>
  );
};

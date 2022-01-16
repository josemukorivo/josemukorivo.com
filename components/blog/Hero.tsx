import { Box, Container, Text, ToggleDark, Link } from '@components/ui';

export const BlogHero = () => {
  return (
    <Container>
      <Box className='flex justify-between pt-4'>
        <Box>
          <span className='mr-2 uppercase font-heading text-sm'>Mail me:</span>
          <Link
            className='uppercase font-heading text-sm border-b pb-[1px] border-slate-500 dark:border-slate-200 hover:border-rose-500'
            href='maito:hello@josemukorivo.dev'
          >
            hello@josemukorivo.dev
          </Link>
        </Box>
        <ToggleDark />
      </Box>
      <Box className='pb-4 md:text-center'>
        <Text as='h2' className='font-medium'>
          My blog
        </Text>
        <Text className='text-base md:text-lg'>
          Get the latest news from myself and what I&lsquo;m currently working
          on.
        </Text>
      </Box>
    </Container>
  );
};

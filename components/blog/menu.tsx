import { Box, Container, ToggleDark, Link } from '@components/ui';

export const BlogMenu = () => {
  return (
    <Box className='hidden md:block pt-4 border-slate-300 bg-slate-100 dark:bg-slate-900 dark:bg-opacity-80 backdrop-blur z-10 dark:border-slate-700 border-b fixed left-[81px] 2xl:left-[100px] right-0 top-0'>
      <Container className='flex justify-between items-center h-10 relative -top-[8px]'>
        <Box>
          <span className='mr-2 uppercase font-heading text-sm 2xl:text-xs'>
            Mail me:
          </span>
          <Link
            className='uppercase font-heading text-sm 2xl:text-xs border-b pb-[1px] border-slate-500 dark:border-slate-200 hover:border-rose-500'
            href='maito:hello@josemukorivo.dev'
          >
            hello@josemukorivo.dev
          </Link>
        </Box>
        <ToggleDark />
      </Container>
    </Box>
  );
};

import { Box, Link } from '@components/ui';

export const MailMe = () => (
  <Box>
    <span className='font-heading mr-2 text-sm uppercase opacity-75 2xl:text-xs'>
      Mail me:
    </span>
    <Link
      className='font-heading border-b border-slate-500 text-sm uppercase hover:border-rose-500 dark:border-slate-200 2xl:text-xs'
      href='maito:hello@josemukorivo.dev'
    >
      hello@josemukorivo.dev
    </Link>
  </Box>
);

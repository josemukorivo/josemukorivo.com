import { Link, ToggleDark } from '@components/ui';

export const Nav = () => {
  return (
    <nav className='flex items-center justify-between border-b px-4 py-3 dark:border-slate-800 md:hidden'>
      <Link
        href='/'
        className='font-heading transform text-3xl font-medium text-rose-500 hover:text-rose-600 dark:text-rose-500'
      >
        {'<JM/>'}
      </Link>
      <ToggleDark />
    </nav>
  );
};

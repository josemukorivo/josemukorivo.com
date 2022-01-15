import { Link, ToggleDark } from '@components/ui';

export const Nav = () => {
  return (
    <nav className='px-4 py-2 md:hidden flex justify-between items-center border-b dark:border-slate-700'>
      <Link
        href='/'
        className='text-rose-500 text-2xl font-heading font-medium transform hover:text-rose-600 dark:text-rose-500'
      >
        {'<JM/>'}
      </Link>

      <ToggleDark />
    </nav>
  );
};

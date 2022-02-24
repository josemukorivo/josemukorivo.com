import { Link } from '@components/ui';

export const Logo = ({ className = '' }) => (
  <Link
    href='/'
    className={`${className} font-heading transform text-3xl font-medium text-rose-500 hover:scale-90 hover:text-rose-600 dark:text-rose-500`}
  >
    {'<JM/>'}
  </Link>
);

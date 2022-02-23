import { Container } from '@components/ui';
import { MailMe, Menu } from '..';

export const Nav = ({ className = '' }) => {
  return (
    <nav
      className={`right-0 top-0 left-[81px] z-10 dark:border-slate-800 2xl:left-20 ${className}`}
    >
      <Container className='flex items-center justify-between'>
        <MailMe />

        <span className='rounded-2xl bg-rose-500 px-5 py-1 text-sm font-medium uppercase text-white'>
          NB: This website is under development
        </span>
        <Menu />
      </Container>
    </nav>
  );
};

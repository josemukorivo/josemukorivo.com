import { Menu } from '@components/common';
import { Box, Container, Link } from '@components/ui';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { MailMe, MenuButton } from '..';
import { Logo } from '../Logo/Logo';

interface Props {
  variant?: 'main' | 'blog';
  className?: string;
}

export const Nav: FC<Props> = ({ className = '', variant = 'main' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { pathname } = useRouter();
  const onOpen = () => setIsMenuOpen(true);
  const onClose = () => setIsMenuOpen(false);
  return (
    <>
      {variant === 'main' && (
        <nav
          className={`right-0 top-0 left-0 z-10 dark:border-slate-800 md:left-[81px] 2xl:left-20 ${className}`}
        >
          <Container className='flex items-center justify-between'>
            <MailMe className='hidden md:block' />
            <Logo className='md:hidden' />
            <MenuButton
              onOpen={onOpen}
              className={pathname === '/' && 'md:text-white'}
            />
          </Container>
        </nav>
      )}
      {variant === 'blog' && (
        <Box className='sticky top-0 z-10 border-b bg-white backdrop-blur backdrop-filter dark:border-slate-700 dark:bg-slate-900 md:bg-opacity-80 md:dark:bg-opacity-90'>
          <Container className='flex items-center justify-between py-4'>
            <Logo className='md:hidden' />
            <Link
              href='/blog'
              className='relative -left-1 hidden items-center font-heading text-xs uppercase hover:text-rose-500 md:flex'
            >
              <MdOutlineKeyboardArrowLeft className='mr-1 h-4 w-auto' /> back to
              blog
            </Link>
            <MenuButton onOpen={onOpen} />
          </Container>
        </Box>
      )}
      <AnimatePresence>
        {isMenuOpen && <Menu onClose={onClose} />}
      </AnimatePresence>
    </>
  );
};

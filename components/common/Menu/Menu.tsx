import { Box, Container, Link } from '@components/ui';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { CloseButton } from './Close';

export const Menu = ({ onClose }) => {
  const { pathname } = useRouter();
  const links = [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
    {
      label: 'Projects',
      href: '/blog',
    },
    {
      label: 'About',
      href: '/#about',
    },

    {
      label: 'Contact',
      href: '/#contact',
    },
  ];

  const getClasses = (path: string) => {
    return cn(
      {
        'text-rose-500': pathname === path,
      },
      'font-heading md:ml-60 max-w-xs px-4 text-4xl uppercase transition duration-100 ease-linear hover:translate-x-[3px] hover:scale-[.98] hover:text-rose-500'
    );
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      transition={{ duration: 0.6 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -20, opacity: 0 }}
      className='fixed top-0 left-0 z-20 h-screen w-full bg-white dark:bg-slate-900'
    >
      <CloseButton onClose={onClose} />
      <Container className='flex h-full flex-col justify-center gap-10'>
        {links.map(({ label, href }) => (
          <Link key={href} href={href} className={getClasses(href)}>
            {label}
          </Link>
        ))}
      </Container>
    </motion.div>
  );
};

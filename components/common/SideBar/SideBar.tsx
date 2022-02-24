import {
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillMail,
} from 'react-icons/ai';

import { Box, Link, Text } from '@components/ui';
import s from './SideBar.module.scss';
import { Logo } from '../Logo/Logo';

export const SideBar = () => {
  const links = [
    {
      href: 'https://github.com/josemkorivo',
      Icon: AiFillGithub,
    },
    {
      href: 'https://twitter.com/josemukorivo',
      Icon: AiFillTwitterCircle,
    },
    {
      href: 'https://www.linkedin.com/in/josemukorivo/',
      Icon: AiFillLinkedin,
    },
    {
      href: 'mailto:hello@josemukorivo.dev',
      Icon: AiFillMail,
    },
  ];

  return (
    <Box className={s.root}>
      <Box className='flex h-full flex-col items-center justify-between'>
        <Logo />
        <Box className='w-64 -rotate-90 transform text-center'>
          <p className='font-heading font-medium uppercase dark:text-slate-200'>
            Software Engineer
          </p>
          <p className='text-sm font-medium uppercase text-slate-500 dark:text-slate-400'>
            Writer & DevOps Enthusiat
          </p>
        </Box>

        <Box>
          {links.map(({ href, Icon }) => (
            <Link
              key={href}
              href={href}
              target='_blank'
              className='mb-5 block dark:hover:text-rose-500'
            >
              <Icon className={s.icon} />
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

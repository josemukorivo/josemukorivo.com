import {
  AiFillLinkedin,
  AiFillGithub,
  AiFillTwitterCircle,
  AiFillMail,
} from 'react-icons/ai';

import { Box, Link, Text } from '@components/ui';
import s from './SideBar.module.scss';

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
      <Box className='flex flex-col items-center justify-between h-full'>
        <Link
          href='/'
          className='text-rose-500 text-3xl font-heading font-medium transform hover:text-rose-600 dark:text-rose-500'
        >
          {'<JM/>'}
        </Link>

        <Box className='transform -rotate-90 w-64 text-center'>
          <p className='uppercase font-medium font-heading dark:text-slate-200'>
            Software Engineer
          </p>
          <p className='uppercase text-sm text-slate-500 dark:text-slate-400 font-medium'>
            Writer & DevOps Enthusiat
          </p>
        </Box>

        <Box>
          {links.map(({ href, Icon }) => (
            <Link
              key={href}
              href={href}
              target='_blank'
              className='block mb-5 dark:hover:text-rose-500'
            >
              <Icon className={s.icon} />
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

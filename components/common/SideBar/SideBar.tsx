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
      href: 'https://github.com/josemukorivo',
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
      <Box className={s.main}>
        <Logo />
        <Box className={s.bar}>
          <Text as='h5' casing='uppercase' className='font-heading mb-1'>
            Software Engineer
          </Text>
          <Text
            casing='uppercase'
            fontSize='xs'
            className='text-slate-500 dark:text-slate-400'
          >
            Writer & DevOps Enthusiat
          </Text>
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

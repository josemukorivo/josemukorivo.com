import { FC, CSSProperties, ReactNode, JSXElementConstructor } from 'react';
import { Box } from '@components/ui';
import { SideBar } from '@components/common';

import s from './Layout.module.scss';
import { Nav } from '../Nav/Nav';
interface Props {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  as?: 'div' | 'section' | JSXElementConstructor<any>;
  full?: boolean;
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <Box className='dark:border-t dark:border-slate-700'>
      <Nav />

      <Box className={s.root}>
        <Box className='md:h-screen'>
          <SideBar />
        </Box>
        <Box className='overflow-x-hidden'>
          <main>{children}</main>
        </Box>
      </Box>
    </Box>
  );
};

import { FC, CSSProperties, ReactNode, JSXElementConstructor } from 'react';
import { Box } from '@components/ui';
import { SideBar } from '@components/common';

import s from './Layout.module.scss';
interface Props {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  as?: 'div' | 'section' | JSXElementConstructor<any>;
  full?: boolean;
}

export const Layout: FC<Props> = ({ children }) => {
  return (
    <div className={s.root}>
      <Box className='md:h-screen'>
        <SideBar />
      </Box>
      <Box className='overflow-x-hidden'>
        <main>{children}</main>
      </Box>
    </div>
  );
};

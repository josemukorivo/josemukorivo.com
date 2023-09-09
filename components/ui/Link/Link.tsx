import cn from 'classnames';
import NextLink, { LinkProps } from 'next/link';
import { FC } from 'react';

import s from './Link.module.scss';

interface Props extends LinkProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

export const Link: FC<Props> = ({
  className = '',
  href,
  onClick,
  children,
  ...rest
}) => {
  const classes = cn(s.root, className);

  return (
    (<NextLink href={href} className={classes} {...rest} onClick={onClick}>

      {children}

    </NextLink>)
  );
};

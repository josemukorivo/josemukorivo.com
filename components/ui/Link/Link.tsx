import { FC } from 'react';
import NextLink, { LinkProps } from 'next/link';
import cn from 'classnames';

import s from './Link.module.scss';

interface Props extends LinkProps {
  className?: string;
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
    <NextLink href={href}>
      <a className={classes} {...rest} onClick={onClick}>
        {children}
      </a>
    </NextLink>
  );
};

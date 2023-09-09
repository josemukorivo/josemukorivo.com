import cn from 'classnames';
import { CSSProperties, FC, ReactNode } from 'react';
import FastMarquee from 'react-fast-marquee';

interface Props {
  className?: string;
  children: ReactNode;
  speed?: number;
  style?: CSSProperties;
  pauseOnHover?: boolean;
  gradient?: boolean;
}

export const Marquee: FC<Props> = ({
  className = '',
  speed = 30,
  style = {},
  pauseOnHover = true,
  gradient = false,
  children,
  ...rest
}) => {
  const classes = cn('overflow-y-hidden', className);
  return (
    <FastMarquee
      gradient={gradient}
      pauseOnHover={pauseOnHover}
      speed={speed}
      className={classes}
      style={style}
      {...rest}
    >
      {children}
    </FastMarquee>
  );
};

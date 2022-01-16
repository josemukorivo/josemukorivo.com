import {
  FC,
  forwardRef,
  useRef,
  ButtonHTMLAttributes,
  JSXElementConstructor,
} from 'react';
import Link from 'next/link';
import cn from 'classnames';

import s from './Button.module.scss';
import { mergeRefs } from '@utils/index';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  target?: '_blank' | '_self' | '_parent' | '_top';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'naked';
  as?: 'button' | 'a' | JSXElementConstructor<any>;
}

export const Button: FC<ButtonProps> = forwardRef((props, buttonRef) => {
  const {
    as: Tag = 'button',
    variant = 'naked',
    size = 'md',
    type = 'button',
    target = '_self',
    href,
    className,
    disabled,
    children,
    ...rest
  } = props;
  const ref = useRef<typeof Tag>(null);
  const classes = cn(
    s.root,
    {
      [s.primary]: variant === 'primary',
      [s.secondary]: variant === 'secondary',
      [s.naked]: variant === 'naked',
      [s.sm]: size === 'sm',
      [s.md]: size === 'md',
      [s.lg]: size === 'lg',
      [s.disabled]: disabled,
    },
    className
  );

  return (
    <>
      {href ? (
        <Tag ref={mergeRefs([ref, buttonRef])} {...rest}>
          <Link href={href}>
            <a className={classes} target={target}>
              {children}
            </a>
          </Link>
        </Tag>
      ) : (
        <Tag
          ref={mergeRefs([ref, buttonRef])}
          disabled={disabled}
          className={classes}
          {...rest}
        >
          {children}
        </Tag>
      )}
    </>
  );
});

Button.displayName = 'Button';

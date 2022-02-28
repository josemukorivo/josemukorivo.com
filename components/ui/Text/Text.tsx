import React, { FC, CSSProperties, ReactNode } from 'react';
import cn from 'classnames';

import s from './Text.module.scss';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type Casing = 'uppercase' | 'lowercase' | 'capitalize' | 'none';
type Weight = 'light' | 'normal' | 'medium' | 'bold';
type Align = 'left' | 'center' | 'right';
type Size =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl';

interface Props {
  as?: Variant;
  fontSize?: Size;
  fontWeight?: Weight;
  casing?: Casing;
  align?: Align;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode | any;
  html?: string;
}

export const Text: FC<Props> = ({
  as: Tag = 'p',
  fontSize = 'lg',
  fontWeight = 'normal',
  className = '',
  casing = 'none',
  align,
  style = {},
  children,
  html,
  ...rest
}) => {
  const classes = cn(
    s.root,
    {
      [s.xs]: fontSize === 'xs',
      [s.sm]: fontSize === 'sm',
      [s.md]: fontSize === 'md',
      [s.lg]: fontSize === 'lg',
      [s.xl]: fontSize === 'xl',
      [s.xxl]: fontSize === '2xl',
      [s.xxxl]: fontSize === '3xl',
      [s.xxxxl]: fontSize === '4xl',
      [s.xxxxxl]: fontSize === '5xl',
      [s.xxxxxxl]: fontSize === '6xl',
      [s.transformNone]: casing === 'none',
      [s.textUppercase]: casing === 'uppercase',
      [s.textLowercase]: casing === 'lowercase',
      [s.textCapitalize]: casing === 'capitalize',
      [s.left]: align === 'left',
      [s.center]: align === 'center',
      [s.right]: align === 'right',
      [s.weightLight]: fontWeight === 'light',
      [s.weightNormal]: fontWeight === 'normal',
      [s.weightMedium]: fontWeight === 'medium',
      [s.weightBold]: fontWeight === 'bold',
    },
    className // make sure to add the className last so it overwrites the other classes
  );

  const htmlProps = html
    ? {
        dangerouslySetInnerHTML: { __html: html },
      }
    : {};

  return (
    <Tag className={classes} {...rest} {...htmlProps}>
      {children}
    </Tag>
  );
};

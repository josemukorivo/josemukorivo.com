import React, { FC, CSSProperties, ReactNode } from 'react';
import cn from 'classnames';

import s from './Text.module.scss';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

interface Props {
  as?: Variant;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode | any;
  html?: string;
}

export const Text: FC<Props> = ({
  as: Tag = 'p',
  className = '',
  style = {},
  children,
  html,
  ...rest
}) => {
  const classes = cn(
    s.root,
    {
      [s.p]: Tag === 'p',
      [s.span]: Tag === 'span',
      [s.h1]: Tag === 'h1',
      [s.h2]: Tag === 'h2',
      [s.h3]: Tag === 'h3',
      [s.h4]: Tag === 'h4',
      [s.h5]: Tag === 'h5',
      [s.h6]: Tag === 'h6',
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

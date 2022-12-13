import { CSSProperties, ReactNode, FC, JSXElementConstructor } from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
  id?: string;
  style?: CSSProperties;
  children?: ReactNode;
  as?: 'div' | 'section' | JSXElementConstructor<any>;
  full?: boolean;
}

export const Container: FC<Props> = ({
  className = '',
  style = {},
  as: Tag = 'div',
  id,
  children,
  full,
  ...rest
}) => {
  const classes = cn(
    {
      'mx-auto max-w-8xl px-5 md:px-10 2xl:px-12': !full,
    },
    className
  );

  return (
    <Tag className={classes} id={id} {...rest}>
      {children}
    </Tag>
  );
};

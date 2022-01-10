import NextImage, { ImageProps } from 'next/image';
import { FC } from 'react';

import s from './Image.module.scss';

interface Props extends ImageProps {}

export const Image: FC<Props> = ({ layout = 'fill', ...rest }) => {
  return (
    <div className={s.root}>
      <NextImage layout={layout} {...rest} className={s.image} />
    </div>
  );
};

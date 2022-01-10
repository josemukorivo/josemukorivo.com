import {
  CSSProperties,
  FC,
  InputHTMLAttributes,
  forwardRef,
  useRef,
} from 'react';
import cn from 'classnames';

import s from './Input.module.scss';
import { mergeRefs } from '@utils/index';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label?: string;
  style?: CSSProperties;
}

export const Input: FC<Props> = forwardRef((props, inputRef) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { className = '', style = {}, label, ...rest } = props;
  const classes = cn(s.root, className);

  return (
    <label className={s.label}>
      {label}
      <input
        ref={mergeRefs([ref, inputRef])}
        className={classes}
        style={style}
        {...rest}
      />
    </label>
  );
});

Input.displayName = 'Input';

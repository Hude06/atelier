import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Stack.module.css';

type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
type StackAlign = 'start' | 'center' | 'end' | 'stretch';

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: StackGap;
  align?: StackAlign;
  children: ReactNode;
}

export function Stack({ gap = 4, align, className, children, ...rest }: StackProps) {
  const cls = [
    styles.stack,
    styles[`gap-${gap}`],
    align ? styles[`align-${align}`] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

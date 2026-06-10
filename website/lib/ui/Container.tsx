import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Container.module.css';

type ContainerWidth = 'narrow' | 'default' | 'wide' | 'full' | 'fluid';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  children: ReactNode;
}

export function Container({ width = 'default', className, children, ...rest }: ContainerProps) {
  const cls = [styles.container, styles[width], className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

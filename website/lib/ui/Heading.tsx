import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Heading.module.css';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | 'display' | 'hero';
type HeadingTone = 'default' | 'muted' | 'accent';
type HeadingAlign = 'left' | 'center' | 'right';

const defaultSizeForLevel: Record<HeadingLevel, HeadingSize> = {
  1: 'display',
  2: 'xl',
  3: 'lg',
  4: 'md',
  5: 'sm',
  6: 'sm',
};

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  size?: HeadingSize;
  tone?: HeadingTone;
  align?: HeadingAlign;
  children: ReactNode;
}

export function Heading({ level = 2, size, tone, align, className, children, ...rest }: HeadingProps) {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const resolvedSize = size ?? defaultSizeForLevel[level];

  const cls = [
    styles.heading,
    styles[resolvedSize],
    tone ? styles[`tone-${tone}`] : null,
    align ? styles[`align-${align}`] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  );
}

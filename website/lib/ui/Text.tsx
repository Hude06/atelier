import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Text.module.css';

type TextSize = 'sm' | 'md' | 'lg' | 'xl';
type TextTone = 'default' | 'muted' | 'accent';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';
type TextAlign = 'left' | 'center' | 'right';

interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  align?: TextAlign;
  children: ReactNode;
}

export function Text({ size = 'md', tone, weight, align, className, children, ...rest }: TextProps) {
  const cls = [
    styles.text,
    styles[size],
    tone ? styles[`tone-${tone}`] : null,
    weight ? styles[`weight-${weight}`] : null,
    align ? styles[`align-${align}`] : null,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <p className={cls} {...rest}>
      {children}
    </p>
  );
}

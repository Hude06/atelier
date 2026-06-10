/* eslint-disable @next/next/no-img-element */
import type { HeroBlock as HeroBlockType } from '@/lib/types';
import { Container, Heading, Button } from '@/lib/ui';
import styles from './HeroBlock.module.css';

export function HeroBlock({ block }: { block: HeroBlockType }) {
  const alignClass = styles[`align-${block.align ?? 'left'}`];

  return (
    <section className={styles.hero}>
      <Container width="wide">
        <div className={[styles.inner, alignClass].join(' ')}>
          <Heading level={1} size="hero">
            {block.title}
          </Heading>

          {block.subtitle && <p className={styles.subtitle}>{block.subtitle}</p>}

          {block.buttons && block.buttons.length > 0 && (
            <div className={styles.buttons}>
              {block.buttons.map((btn, i) => (
                <Button
                  key={i}
                  href={btn.href}
                  variant={btn.variant ?? (i === 0 ? 'primary' : 'secondary')}
                  size="lg"
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          )}

          {block.image && (
            <img src={block.image} alt={block.title} className={styles.image} />
          )}
        </div>
      </Container>
    </section>
  );
}

import type { SectionBlock as SectionBlockType } from '@/lib/types';
import { Container } from '@/lib/ui';
import styles from './SectionBlock.module.css';

export function SectionBlock({ block }: { block: SectionBlockType }) {
  const bgClass = styles[`bg-${block.background ?? 'default'}`];
  const padClass = styles[`padding-${block.padding ?? 'md'}`];

  return (
    <section
      id={block.anchor}
      className={[styles.section, bgClass, padClass].join(' ')}
    >
      <Container width="wide">
        <div className={styles.inner}>
          {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
          {block.body && <p className={styles.body}>{block.body}</p>}
        </div>
      </Container>
    </section>
  );
}

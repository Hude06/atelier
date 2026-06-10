/* eslint-disable @next/next/no-img-element */
import type { QuoteBlock as QuoteBlockType } from '@/lib/types';
import { Container } from '@/lib/ui';
import styles from './QuoteBlock.module.css';

export function QuoteBlock({ block }: { block: QuoteBlockType }) {
  return (
    <figure className={styles.figure}>
      <Container width="wide">
        <div className={styles.inner}>
          <blockquote className={styles.quote}>{block.quote}</blockquote>
          {(block.author || block.image) && (
            <figcaption className={styles.caption}>
              {block.image && (
                <img src={block.image} alt={block.author ?? ''} className={styles.avatar} />
              )}
              <div>
                {block.author && <p className={styles.author}>{block.author}</p>}
                {block.role && <p className={styles.role}>{block.role}</p>}
              </div>
            </figcaption>
          )}
        </div>
      </Container>
    </figure>
  );
}

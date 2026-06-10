/* eslint-disable @next/next/no-img-element */
import type { GridBlock as GridBlockType } from '@/lib/types';
import { Container } from '@/lib/ui';
import styles from './GridBlock.module.css';

export function GridBlock({ block }: { block: GridBlockType }) {
  const colsClass = styles[`cols-${block.columns ?? 3}`];

  return (
    <div className={styles.wrapper}>
      <Container width="wide">
        {block.heading && <h2 className={styles.heading}>{block.heading}</h2>}
        <div className={[styles.grid, colsClass].join(' ')}>
          {block.items.map((item, i) => (
            <div key={i} className={styles.card}>
              {item.image && (
                <img src={item.image} alt={item.imageAlt ?? item.title} className={styles['card-image']} />
              )}
              <p className={styles['card-title']}>{item.title}</p>
              {item.body && <p className={styles['card-body']}>{item.body}</p>}
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import type { TwoColumnBlock as TwoColumnBlockType, ColumnSide } from '@/lib/types';
import { Container, Button } from '@/lib/ui';
import styles from './TwoColumnBlock.module.css';

function Side({ side }: { side: ColumnSide }) {
  return (
    <div>
      {side.image && <img src={side.image} alt={side.title ?? ''} className={styles['side-image']} />}
      {side.title && <h2 className={styles['side-title']}>{side.title}</h2>}
      {side.body && <p className={styles['side-body']}>{side.body}</p>}
      {side.button && (
        <div className={styles['side-button']}>
          <Button href={side.button.href} variant={side.button.variant ?? 'primary'}>
            {side.button.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export function TwoColumnBlock({ block }: { block: TwoColumnBlockType }) {
  const ratioClass = styles[`ratio-${block.ratio ?? '50-50'}`];

  return (
    <div className={styles.wrapper}>
      <Container width="wide">
        <div className={[styles.grid, ratioClass].join(' ')}>
          <Side side={block.left} />
          <Side side={block.right} />
        </div>
      </Container>
    </div>
  );
}

import type { ButtonBlock as ButtonBlockType } from '@/lib/types';
import { Container, Button } from '@/lib/ui';
import blockStyles from './Block.module.css';
import styles from './ButtonBlock.module.css';

export function ButtonBlock({ block }: { block: ButtonBlockType }) {
  const alignClass = styles[`align-${block.align ?? 'left'}`];
  return (
    <div className={blockStyles['block-tight']}>
      <Container>
        <div className={[styles.wrapper, alignClass].join(' ')}>
          <Button variant={block.variant ?? 'primary'} size={block.size ?? 'md'} href={block.href}>
            {block.label}
          </Button>
        </div>
      </Container>
    </div>
  );
}

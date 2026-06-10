import type { HeadingBlock as HeadingBlockType } from '@/lib/types';
import { Container, Heading } from '@/lib/ui';
import blockStyles from './Block.module.css';

export function HeadingBlock({ block }: { block: HeadingBlockType }) {
  return (
    <div className={blockStyles['block-tight']}>
      <Container>
        <Heading level={block.level ?? 2} size={block.size} tone={block.tone} align={block.align}>
          {block.text}
        </Heading>
      </Container>
    </div>
  );
}

import type { TextBlock as TextBlockType } from '@/lib/types';
import { Container, Stack, Text } from '@/lib/ui';
import blockStyles from './Block.module.css';

export function TextBlock({ block }: { block: TextBlockType }) {
  const paragraphs = block.body
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={blockStyles['block-tight']}>
      <Container>
        <Stack gap={4}>
          {paragraphs.map((p, i) => (
            <Text key={i} size={block.size} tone={block.tone} weight={block.weight} align={block.align}>
              {p}
            </Text>
          ))}
        </Stack>
      </Container>
    </div>
  );
}

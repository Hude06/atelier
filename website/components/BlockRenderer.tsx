import type { ComponentType } from 'react';
import type { Block } from '@/lib/types';
import { HeadingBlock } from './blocks/HeadingBlock';
import { TextBlock } from './blocks/TextBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ButtonBlock } from './blocks/ButtonBlock';
import { HeroBlock } from './blocks/HeroBlock';
import { SectionBlock } from './blocks/SectionBlock';
import { GridBlock } from './blocks/GridBlock';
import { TwoColumnBlock } from './blocks/TwoColumnBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { FormBlock } from './blocks/FormBlock';

type BlockRegistry = Record<string, ComponentType<{ block: never }>>;

export const frameworkBlocks: BlockRegistry = {
  heading: HeadingBlock as ComponentType<{ block: never }>,
  text: TextBlock as ComponentType<{ block: never }>,
  image: ImageBlock as ComponentType<{ block: never }>,
  button: ButtonBlock as ComponentType<{ block: never }>,
  hero: HeroBlock as ComponentType<{ block: never }>,
  section: SectionBlock as ComponentType<{ block: never }>,
  grid: GridBlock as ComponentType<{ block: never }>,
  'two-column': TwoColumnBlock as ComponentType<{ block: never }>,
  quote: QuoteBlock as ComponentType<{ block: never }>,
  form: FormBlock as ComponentType<{ block: never }>,
};

interface BlockRendererProps {
  blocks: Block[];
  registry?: BlockRegistry;
}

export function BlockRenderer({ blocks, registry = frameworkBlocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block) => {
        const Component = registry[block.type];
        if (!Component) return null;
        return <Component key={block.id} block={block as never} />;
      })}
    </>
  );
}

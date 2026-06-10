/* eslint-disable @next/next/no-img-element */
import type { ImageBlock as ImageBlockType } from '@/lib/types';
import styles from './ImageBlock.module.css';

export function ImageBlock({ block }: { block: ImageBlockType }) {
  const widthClass = styles[block.width ?? 'lg'];
  return (
    <div className={styles.wrapper}>
      <div className={[styles.inner, widthClass].join(' ')}>
        <img src={block.src} alt={block.alt} className={styles.img} />
        {block.caption && <p className={styles.caption}>{block.caption}</p>}
      </div>
    </div>
  );
}

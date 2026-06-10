import { notFound } from 'next/navigation';
import { loadPage } from '@/lib/content';
import { BlockRenderer, frameworkBlocks } from '@/components/BlockRenderer';
import { clientBlocks } from '@/client/registry';

export default async function HomePage() {
  const page = loadPage('home');
  if (!page) notFound();

  const registry = { ...frameworkBlocks, ...clientBlocks };
  return <BlockRenderer blocks={page.blocks} registry={registry} />;
}

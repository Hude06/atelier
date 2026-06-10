import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadPage, listPages } from '@/lib/content';
import { BlockRenderer, frameworkBlocks } from '@/components/BlockRenderer';
import { clientBlocks } from '@/client/registry';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return listPages()
    .filter((slug) => slug !== 'home')
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = loadPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const page = loadPage(slug);
  if (!page) notFound();

  const registry = { ...frameworkBlocks, ...clientBlocks };
  return <BlockRenderer blocks={page.blocks} registry={registry} />;
}

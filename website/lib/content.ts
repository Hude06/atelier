import { readFileSync, readdirSync } from 'fs';
import { resolve, join } from 'path';
import type { PageContent, SiteConfig } from './types';

const PAGES_DIR = resolve(process.cwd(), 'content/pages');
const SITE_CONFIG_PATH = resolve(process.cwd(), 'content/site.json');

const SLUG_RE = /^[a-z0-9-]{1,100}$/;

function assertInsidePages(resolved: string) {
  if (!resolved.startsWith(PAGES_DIR + '/')) {
    throw new Error('Path traversal detected');
  }
}

export function loadPage(slug: string): PageContent | null {
  if (!SLUG_RE.test(slug)) return null;
  const filePath = join(PAGES_DIR, `${slug}.json`);
  assertInsidePages(resolve(filePath));
  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as PageContent;
  } catch {
    return null;
  }
}

export function loadSiteConfig(): SiteConfig {
  try {
    const raw = readFileSync(SITE_CONFIG_PATH, 'utf-8');
    return JSON.parse(raw) as SiteConfig;
  } catch {
    return {
      siteName: 'Void Studio',
      nav: [
        { label: 'Home', href: '/' },
        { label: 'Work', href: '/work' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    };
  }
}

export function listPages(): string[] {
  try {
    return readdirSync(PAGES_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}

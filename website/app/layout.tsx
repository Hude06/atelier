import type { Metadata } from 'next';
import { loadSiteConfig } from '@/lib/content';
import { SiteShell } from '@/site/shell';
import './globals.css';
import '@/site/styles.css';

export async function generateMetadata(): Promise<Metadata> {
  const config = loadSiteConfig();
  return {
    title: {
      default: config.siteName,
      template: `%s — ${config.siteName}`,
    },
    description: 'A quiet kanban board for Mac. Local-first, no accounts, no noise.',
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const config = loadSiteConfig();
  const theme = config.theme?.preset ?? 'warm';
  const appearance = config.theme?.appearance ?? 'light';

  return (
    <html lang="en" data-theme={theme} data-appearance={appearance}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,600;9..144,700&family=Schibsted+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-heading: 'Fraunces', Georgia, serif;
            --font-body: 'Schibsted Grotesk', system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body>
        <SiteShell config={config}>{children}</SiteShell>
      </body>
    </html>
  );
}

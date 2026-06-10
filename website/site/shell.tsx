import type { ReactNode } from 'react';
import type { SiteConfig } from '@/lib/types';
import { Container } from '@/lib/ui';
import styles from './shell.module.css';

interface SiteShellProps {
  config: SiteConfig;
  children: ReactNode;
}

export function SiteShell({ config, children }: SiteShellProps) {
  const year = new Date().getFullYear();
  const navLinks = config.nav.slice(0, -1);
  const ctaLink = config.nav[config.nav.length - 1];

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Container width="wide">
          <div className={styles.headerInner}>
            <a href="/" className={styles.logo}>
              {config.siteName}
            </a>
            <nav className={styles.nav}>
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={styles.navLink}>
                  {link.label}
                </a>
              ))}
              {ctaLink && (
                <a href={ctaLink.href} className={styles.navCta}>
                  {ctaLink.label}
                </a>
              )}
            </nav>
          </div>
        </Container>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <Container width="wide">
          <div className={styles.footerInner}>
            <a href="/" className={styles.footerLogo}>
              {config.siteName}
            </a>
            <nav className={styles.footerNav}>
              {config.nav.map((link) => (
                <a key={link.href} href={link.href} className={styles.footerLink}>
                  {link.label}
                </a>
              ))}
            </nav>
            <p className={styles.footerCopy}>
              © {year} {config.siteName} — your data stays on your device
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

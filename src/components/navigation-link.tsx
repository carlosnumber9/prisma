import Link from 'next/link';
import type { ComponentProps } from 'react';
import styles from './navigation-link.module.css';

type NavigationLinkProps = ComponentProps<typeof Link> & {
  tone?: 'neutral' | 'accent';
};

export function NavigationLink({
  children,
  className,
  tone = 'neutral',
  ...props
}: NavigationLinkProps) {
  return (
    <Link
      {...props}
      className={[styles.link, tone === 'accent' && styles.accent, className]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.background} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
    </Link>
  );
}

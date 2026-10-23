import Link from 'next/link';
import type { ComponentProps } from 'react';
import styles from './navigation-link.module.css';

type NavigationLinkProps = ComponentProps<typeof Link> & {
  tone?: 'neutral' | 'accent';
  disabled?: boolean;
};

export function NavigationLink({
  children,
  className,
  tone = 'neutral',
  disabled = false,
  ...props
}: NavigationLinkProps) {
  const linkClass = [styles.link, tone === 'accent' && styles.accent, className]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      <span className={styles.background} aria-hidden="true" />
      <span className={styles.content}>{children}</span>
    </>
  );
  if (disabled)
    return (
      <button type="button" disabled className={linkClass}>
        {content}
      </button>
    );
  return (
    <Link {...props} className={linkClass}>
      {content}
    </Link>
  );
}

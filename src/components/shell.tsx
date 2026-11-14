import type { ReactNode } from 'react';
import styles from './portal.module.css';

export function Shell({
  children,
  background,
}: {
  children: ReactNode;
  background?: ReactNode;
}) {
  return (
    <>
      {background}
      <div className={styles.routeContent} data-route-content>
        {children}
      </div>
    </>
  );
}

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className={styles.pageHeader}>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}

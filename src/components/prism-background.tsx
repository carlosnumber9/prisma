'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './prism-background.module.css';

export function PrismBackground({ anchorId }: { anchorId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;
    const controller = new AbortController();
    const canvas = canvasRef.current;
    const anchor = document.getElementById(anchorId);
    if (!canvas || !anchor) return;

    void import('./prism-renderer')
      .then(async ({ startPrism }) => {
        if (disposed) return;
        teardown = await startPrism(
          canvas,
          anchor,
          {
            onReady: () => {
              if (!disposed) setReady(true);
            },
            onFallback: () => {
              if (!disposed) setReady(false);
            },
          },
          controller.signal,
        );
        if (disposed) teardown();
      })
      .catch(() => {
        if (!disposed) setReady(false);
      });

    return () => {
      disposed = true;
      controller.abort();
      teardown?.();
    };
  }, [anchorId]);

  return (
    <div className={styles.scene} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-prism-ready={ready}
        aria-hidden="true"
      />
    </div>
  );
}

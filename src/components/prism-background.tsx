'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './prism-background.module.css';

export function PrismBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;
    const controller = new AbortController();
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return;

    void import('./prism-renderer')
      .then(async ({ startPrism }) => {
        if (disposed) return;
        teardown = await startPrism(
          canvas,
          viewport,
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
  }, []);

  return (
    <div className={styles.scene} aria-hidden="true">
      <div ref={viewportRef} className={styles.viewport} />
      {/* The same GPU-rendered frame also covers loading and unsupported browsers. */}
      <Image
        className={styles.poster}
        src="/prism-poster.png"
        alt=""
        aria-hidden="true"
        width={1440}
        height={720}
        priority
        unoptimized
      />
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-ready={ready}
        aria-hidden="true"
      />
    </div>
  );
}

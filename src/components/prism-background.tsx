'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './prism-background.module.css';

export function PrismBackground({ anchorId }: { anchorId: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let disposed = false;
    let teardown: (() => void) | undefined;
    const controller = new AbortController();
    const canvas = canvasRef.current;
    const anchor = document.getElementById(anchorId);
    if (!canvas || !anchor) return;

    const scene = sceneRef.current;
    const measureOrigin = () => {
      if (!scene) return;
      const reference = anchor.getBoundingClientRect();
      canvas.style.transformOrigin = `50% ${reference.top + reference.height / 2 - scene.getBoundingClientRect().top}px`;
    };
    measureOrigin();
    const observer = new ResizeObserver(measureOrigin);
    observer.observe(anchor);
    if (anchor.parentElement) observer.observe(anchor.parentElement);

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
      observer.disconnect();
      disposed = true;
      controller.abort();
      teardown?.();
    };
  }, [anchorId]);

  return (
    <div
      ref={sceneRef}
      className={styles.scene}
      data-prism-scene
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        data-prism-ready={ready}
        aria-hidden="true"
      />
    </div>
  );
}

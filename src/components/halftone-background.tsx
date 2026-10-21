'use client';

import { useEffect, useRef, useState } from 'react';
import { startHalftone } from './halftone-renderer';
import styles from './portal.module.css';

export function HalftoneBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    return startHalftone(canvas, setReady);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={styles.halftoneCanvas}
      data-halftone-ready={ready}
      aria-hidden="true"
    />
  );
}

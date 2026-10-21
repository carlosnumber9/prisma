import {
  HALFTONE_COLOR,
  HALFTONE_SIZE,
  HALFTONE_SPACING,
  halftoneRadius,
} from '../lib/halftone';

export function startHalftone(
  canvas: HTMLCanvasElement,
  onReady: (ready: boolean) => void,
) {
  const renderingContext = canvas.getContext('2d');
  const container = canvas.parentElement;
  if (!renderingContext || !container) return;
  const context = renderingContext;
  const shell = container;

  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame: number | undefined;
  let previous: number | undefined;
  let elapsed = 0;
  let failed = false;
  let ready = false;
  let width = 0;
  let height = 0;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let bottom = 0;

  function setReady(value: boolean) {
    if (value === ready) return;
    ready = value;
    onReady(value);
  }

  function stop() {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    previous = undefined;
  }

  function position() {
    const bounds = shell.getBoundingClientRect();
    const style = getComputedStyle(shell);
    const minimumWidth =
      parseFloat(style.getPropertyValue('--dot-texture-min-width')) || 960;
    const textureWidth = Math.max(bounds.width, minimumWidth);
    scale = textureWidth / HALFTONE_SIZE;
    offsetX = bounds.left + (bounds.width - textureWidth) / 2;
    offsetY = bounds.top + parseFloat(style.borderTopWidth);
    bottom = bounds.bottom;
  }

  function draw() {
    if (failed || motion.matches) return;
    try {
      context.clearRect(0, 0, width, height);
      context.beginPath();
      const step = HALFTONE_SPACING * scale;
      const firstColumn = Math.max(0, Math.floor(-offsetX / step));
      const firstRow = Math.max(0, Math.floor(-offsetY / step));
      const columns = HALFTONE_SIZE / HALFTONE_SPACING;
      for (
        let row = firstRow;
        offsetY + row * step < Math.min(height, bottom);
        row++
      ) {
        const worldY = (row + 0.5) * HALFTONE_SPACING;
        const y = offsetY + worldY * scale;
        for (let column = firstColumn; column < columns; column++) {
          const worldX = (column + 0.5) * HALFTONE_SPACING;
          const x = offsetX + worldX * scale;
          if (x > width + step) break;
          const radius = halftoneRadius(worldX, worldY, elapsed);
          if (radius < 0.12) continue;
          context.moveTo(x + radius * scale, y);
          context.arc(x, y, radius * scale, 0, Math.PI * 2);
        }
      }
      context.fillStyle = HALFTONE_COLOR;
      context.fill();
      setReady(true);
    } catch {
      failed = true;
      stop();
      setReady(false);
    }
  }

  function tick(now: number) {
    frame = undefined;
    if (previous === undefined) previous = now;
    if (now - previous >= 1000 / 24) {
      elapsed += Math.min((now - previous) / 1000, 0.1);
      previous = now;
      draw();
    }
    if (!failed) frame = requestAnimationFrame(tick);
  }

  function measure() {
    const bounds = canvas.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    position();
    draw();
  }

  function playback() {
    stop();
    if (motion.matches || failed) {
      setReady(false);
      return;
    }
    if (document.hidden) return;
    measure();
    if (!failed) frame = requestAnimationFrame(tick);
  }

  const observer = new ResizeObserver(measure);
  observer.observe(shell);
  window.addEventListener('resize', measure);
  window.addEventListener('scroll', position, { passive: true });
  document.addEventListener('visibilitychange', playback);
  motion.addEventListener('change', playback);
  playback();

  return () => {
    stop();
    observer.disconnect();
    window.removeEventListener('resize', measure);
    window.removeEventListener('scroll', position);
    document.removeEventListener('visibilitychange', playback);
    motion.removeEventListener('change', playback);
  };
}

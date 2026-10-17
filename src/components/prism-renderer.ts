import { clock, effect, frame, frameLoop, init, surface } from 'vgpu';
import type { FrameLoopHandle } from 'vgpu';
import { PRISM_BEAM_PALETTE } from '../lib/prism-palette';
import prismShader from './prism.wgsl';

type Callbacks = {
  onReady: () => void;
  onFallback: () => void;
};

export async function startPrism(
  canvas: HTMLCanvasElement,
  anchor: HTMLElement,
  callbacks: Callbacks,
  signal: AbortSignal,
) {
  const gpu = await init({
    powerPreference: 'low-power',
    label: 'Prisma hero',
  });
  let loop: FrameLoopHandle | undefined;
  let disposed = false;
  const cleanups: (() => void)[] = [];
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    loop?.stop();
    cleanups.forEach((cleanup) => cleanup());
    gpu.dispose();
  };
  if (signal.aborted) {
    dispose();
    return dispose;
  }
  signal.addEventListener('abort', dispose, { once: true });
  cleanups.push(() => signal.removeEventListener('abort', dispose));

  try {
    let visible = true;
    let elapsed = 0;
    let previousTime: number | undefined;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const canvasSurface = surface(gpu, canvas, { dpr: [1, 1.5] });
    const measureScene = () => {
      const bounds = canvas.getBoundingClientRect();
      const reference = anchor.getBoundingClientRect();
      const height = Math.max(bounds.height, 1);
      // The layout anchor reserves the central half of the shader's image height.
      const worldUnitsPerPixel = 3.65 / Math.max(reference.height * 2, 1);
      return {
        aspect: canvasSurface.size[0] / canvasSurface.size[1],
        worldHeight: height * worldUnitsPerPixel,
        centerY: (reference.top + reference.height / 2 - bounds.top) / height,
      };
    };
    const prism = effect(gpu, prismShader, {
      label: 'Glass prism and four light beams',
      set: {
        beamPalette: PRISM_BEAM_PALETTE,
        params: {
          time: 0,
          ...measureScene(),
          seed: Math.random() * 100,
        },
      },
    });
    const time = clock(gpu);
    const fail = () => {
      if (disposed) return;
      callbacks.onFallback();
      dispose();
    };
    cleanups.push(gpu.onError(fail));
    void gpu.lost.then(fail);

    const renderStill = () => {
      if (disposed) return;
      try {
        frame(gpu, (current) => current.pass(canvasSurface, prism));
      } catch {
        fail();
      }
    };
    const updatePlayback = () => {
      loop?.stop();
      loop = undefined;
      previousTime = undefined;
      if (disposed) return;
      if (reducedMotion.matches || !visible || document.hidden) {
        if (visible && !document.hidden) renderStill();
        return;
      }
      loop = frameLoop(
        gpu,
        (current) => {
          try {
            if (previousTime !== undefined)
              elapsed += Math.min(time.time - previousTime, 0.1);
            previousTime = time.time;
            prism.set({ params: { time: elapsed } });
            current.pass(canvasSurface, prism);
          } catch {
            // Release resources after the current frame has closed.
            queueMicrotask(fail);
          }
        },
        { fps: 30 },
      );
    };
    cleanups.push(
      canvasSurface.onResize(() => {
        prism.set({
          params: measureScene(),
        });
      }),
    );
    const resize = new ResizeObserver(() => {
      if (disposed) return;
      prism.set({ params: measureScene() });
      if (!loop) renderStill();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      updatePlayback();
    });
    cleanups.push(
      () => resize.disconnect(),
      () => intersection.disconnect(),
    );

    await prism.compile(canvasSurface);
    if (disposed) return dispose;
    renderStill();
    await gpu.settled();
    if (disposed) return dispose;
    callbacks.onReady();
    resize.observe(canvas);
    resize.observe(anchor);
    if (anchor.parentElement) {
      resize.observe(anchor.parentElement);
      for (const child of anchor.parentElement.children) resize.observe(child);
    }
    intersection.observe(canvas);
    reducedMotion.addEventListener('change', updatePlayback);
    document.addEventListener('visibilitychange', updatePlayback);
    cleanups.push(
      () => reducedMotion.removeEventListener('change', updatePlayback),
      () => document.removeEventListener('visibilitychange', updatePlayback),
    );
    updatePlayback();
    return dispose;
  } catch (error) {
    dispose();
    throw error;
  }
}

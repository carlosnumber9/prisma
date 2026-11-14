import { gsap } from 'gsap';

export type MotionFrame = {
  opacity?: number;
  height?: string;
  width?: string;
  transform?: string;
  clipPath?: string;
};

export type Motion = { finished: Promise<void>; cancel: () => void };

export function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Native animation is the default; GSAP supports engines without Web Animations. */
export function animateElement(
  element: HTMLElement,
  from: MotionFrame,
  to: MotionFrame,
  duration: number,
): Motion {
  if (typeof element.animate === 'function') {
    const animation = element.animate([from, to], {
      duration,
      easing: 'ease-in-out',
      fill: 'both',
    });
    return {
      finished: animation.finished.then(
        () => {},
        () => {},
      ),
      cancel: () => animation.cancel(),
    };
  }
  const original = element.getAttribute('style');
  let complete: () => void = () => {};
  const finished = new Promise<void>((resolve) => {
    complete = resolve;
  });
  const tween = gsap.fromTo(element, from, {
    ...to,
    duration: duration / 1000,
    ease: 'power1.inOut',
    onComplete: () => complete(),
  });
  return {
    finished,
    cancel: () => {
      tween.kill();
      if (original === null) element.removeAttribute('style');
      else element.setAttribute('style', original);
      complete();
    },
  };
}

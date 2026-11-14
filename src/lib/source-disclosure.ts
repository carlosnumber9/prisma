import { animateElement, reducedMotion, type Motion } from './motion.ts';

/** Keep native disclosure semantics while height and opacity run in sequence. */
export function installSourceDisclosure(
  details: HTMLDetailsElement,
  body: HTMLElement,
) {
  const summary = details.querySelector('summary')!;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let desired = details.open;
  let generation = 0;
  let animation: Motion | undefined;
  let width = details.getBoundingClientRect().width;

  const expose = (visible: boolean) => {
    body.inert = !visible;
    body.setAttribute('aria-hidden', String(!visible));
  };
  const settle = () => {
    generation++;
    animation?.cancel();
    animation = undefined;
    details.open = desired;
    details.style.removeProperty('height');
    details.style.removeProperty('overflow');
    body.style.removeProperty('opacity');
    expose(desired);
  };
  async function toggle() {
    const startHeight = details.getBoundingClientRect().height;
    const startOpacity = details.open
      ? Number(getComputedStyle(body).opacity)
      : 0;
    desired = !desired;
    const ticket = ++generation;
    animation?.cancel();
    if (reducedMotion()) {
      settle();
      return;
    }
    if (!desired && body.contains(document.activeElement)) summary.focus();
    expose(false);
    details.style.height = 'auto';
    details.open = false;
    const closedHeight = details.getBoundingClientRect().height;
    details.open = true;
    const openHeight = details.getBoundingClientRect().height;
    details.style.height = `${startHeight}px`;
    details.style.overflow = 'hidden';
    body.style.opacity = String(startOpacity);

    const height = async (target: number) => {
      const motion = animateElement(
        details,
        { height: `${startHeight}px` },
        { height: `${target}px` },
        140,
      );
      animation = motion;
      await motion.finished;
      if (ticket !== generation) return false;
      motion.cancel();
      details.style.height = `${target}px`;
      return true;
    };
    const opacity = async (target: number) => {
      const motion = animateElement(
        body,
        { opacity: startOpacity },
        { opacity: target },
        80,
      );
      animation = motion;
      await motion.finished;
      if (ticket !== generation) return false;
      motion.cancel();
      body.style.opacity = String(target);
      return true;
    };
    if (desired) {
      if (!(await height(openHeight))) return;
      if (!(await opacity(1))) return;
    } else {
      if (!(await opacity(0))) return;
      if (!(await height(closedHeight))) return;
    }
    settle();
  }
  const click = (event: MouseEvent) => {
    event.preventDefault();
    void toggle();
  };
  const nativeToggle = () => {
    if (!animation && details.open !== desired) {
      desired = details.open;
      settle();
    }
  };
  const resize = () => {
    const next = details.getBoundingClientRect().width;
    if (next !== width) {
      width = next;
      settle();
    }
  };
  const observer =
    typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(resize);
  observer?.observe(details);
  summary.addEventListener('click', click);
  details.addEventListener('toggle', nativeToggle);
  window.addEventListener('resize', resize);
  document.fonts.addEventListener('loadingdone', settle);
  preference.addEventListener('change', settle);
  expose(desired);
  return () => {
    summary.removeEventListener('click', click);
    details.removeEventListener('toggle', nativeToggle);
    window.removeEventListener('resize', resize);
    document.fonts.removeEventListener('loadingdone', settle);
    preference.removeEventListener('change', settle);
    observer?.disconnect();
    settle();
    body.inert = false;
    body.removeAttribute('aria-hidden');
  };
}

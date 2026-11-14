import { animateElement, reducedMotion, type Motion } from './motion.ts';

export function isRouteLink(event: MouseEvent, current: URL) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return false;
  const link =
    event.target instanceof Element ? event.target.closest('a') : null;
  if (
    !link ||
    link.hasAttribute('download') ||
    (link.target && link.target !== '_self') ||
    link.rel.split(/\s+/).includes('external')
  )
    return false;
  const destination = new URL(link.href, current);
  return (
    destination.origin === current.origin &&
    destination.pathname !== current.pathname
  );
}

/** A visual, inert outgoing layer avoids retaining stale Next router contexts. */
export function installRouteFades(root: HTMLElement) {
  let outgoing: HTMLElement | undefined;
  let exit: Motion | undefined;
  let entrance: Motion | undefined;
  let hidden: HTMLElement | undefined;
  let recovery: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;
  let committedPath = window.location.pathname;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const content = () => root.querySelector<HTMLElement>('[data-route-content]');

  const restore = () => {
    hidden?.style.removeProperty('opacity');
    if (hidden) hidden.inert = false;
    hidden = undefined;
  };
  const settle = () => {
    generation++;
    clearTimeout(recovery);
    exit?.cancel();
    entrance?.cancel();
    exit = entrance = undefined;
    outgoing?.remove();
    outgoing = undefined;
    restore();
  };
  const prepare = () => {
    if (reducedMotion() || outgoing) return;
    const current = content();
    if (!current) return;
    settle();
    const bounds = current.getBoundingClientRect();
    outgoing = current.cloneNode(true) as HTMLElement;
    outgoing.removeAttribute('data-route-content');
    outgoing.removeAttribute('id');
    outgoing
      .querySelectorAll('[id]')
      .forEach((node) => node.removeAttribute('id'));
    outgoing.setAttribute('aria-hidden', 'true');
    outgoing.inert = true;
    Object.assign(outgoing.style, {
      position: 'fixed',
      left: `${bounds.left}px`,
      top: `${bounds.top}px`,
      width: `${bounds.width}px`,
      margin: '0',
      pointerEvents: 'none',
      zIndex: '2',
    });
    const theme = getComputedStyle(root);
    for (const name of ['--accent', '--accent-foreground'])
      outgoing.style.setProperty(name, theme.getPropertyValue(name));
    root.append(outgoing);
    hidden = current;
    current.style.opacity = '0';
    current.inert = true;
    exit = animateElement(outgoing, { opacity: 1 }, { opacity: 0 }, 100);
    // A cancelled navigation must never leave the current document invisible.
    recovery = setTimeout(settle, 5000);
  };
  const click = (event: MouseEvent) => {
    if (isRouteLink(event, new URL(window.location.href))) {
      prepare();
    }
  };
  const pop = () => {
    if (window.location.pathname !== committedPath) prepare();
  };
  document.addEventListener('click', click, true);
  window.addEventListener('popstate', pop, true);
  preference.addEventListener('change', settle);

  return {
    async enter() {
      committedPath = window.location.pathname;
      if (reducedMotion()) {
        settle();
        return;
      }
      const current = content();
      if (!current) {
        settle();
        return;
      }
      const ticket = ++generation;
      clearTimeout(recovery);
      entrance?.cancel();
      restore();
      hidden = current;
      current.style.opacity = '0';
      current.inert = true;
      await exit?.finished;
      if (ticket !== generation) return;
      exit?.cancel();
      exit = undefined;
      outgoing?.remove();
      outgoing = undefined;
      const animation = animateElement(
        current,
        { opacity: 0 },
        { opacity: 1 },
        120,
      );
      entrance = animation;
      await animation.finished;
      if (ticket !== generation) return;
      animation.cancel();
      entrance = undefined;
      restore();
    },
    dispose() {
      settle();
      document.removeEventListener('click', click, true);
      window.removeEventListener('popstate', pop, true);
      preference.removeEventListener('change', settle);
    },
  };
}

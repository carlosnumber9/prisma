import { ribbonRevealEase, ribbonRevealGeometry } from '../lib/ribbon-reveal';

export function createRibbonReveal(
  definitions: SVGSVGElement,
  link: HTMLAnchorElement,
  id: string,
  mirrored: boolean,
) {
  const namespace = 'http://www.w3.org/2000/svg';
  const mask = document.createElementNS(namespace, 'mask');
  const path = document.createElementNS(namespace, 'path');
  const progress = { lateral: 0, horizontal: 0 };
  let geometry: ReturnType<typeof ribbonRevealGeometry>;

  mask.id = id;
  mask.setAttribute('maskUnits', 'userSpaceOnUse');
  mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'white');
  path.setAttribute('stroke-linejoin', 'round');
  mask.append(path);
  definitions.append(mask);

  const draw = () => {
    const lateralLength = geometry.length - geometry.horizontalLength;
    const remaining =
      (1 - progress.lateral) * lateralLength +
      (1 - progress.horizontal) * geometry.horizontalLength;
    path.setAttribute('stroke-dashoffset', String(remaining));
  };

  const refresh = () => {
    const { width, height } = link.getBoundingClientRect();
    // The empty SVG viewport resolves the same responsive lengths as CSS.
    const fold = definitions.getBoundingClientRect();
    geometry = ribbonRevealGeometry({
      width,
      height,
      foldWidth: fold.width,
      foldRise: fold.height,
      mirrored,
    });
    for (const [name, value] of Object.entries(geometry.bounds)) {
      mask.setAttribute(name, String(value));
    }
    path.setAttribute('d', geometry.path);
    path.setAttribute('stroke-width', String(geometry.strokeWidth));
    path.setAttribute('stroke-dasharray', String(geometry.length));
    draw();
  };
  refresh();

  return {
    progress,
    draw,
    refresh,
    ease: (time: number) => ribbonRevealEase(time, geometry),
    remove: () => mask.remove(),
  };
}

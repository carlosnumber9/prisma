export function ribbonRevealGeometry({
  width,
  height,
  foldWidth,
  foldRise,
  mirrored,
}: {
  width: number;
  height: number;
  foldWidth: number;
  foldRise: number;
  mirrored: boolean;
}) {
  const overhang = 8;
  const shadow = 16;
  const strokeWidth = height + shadow * 2;
  const slope = foldRise / foldWidth;
  const leadingReach = (strokeWidth / 2) * (slope / Math.hypot(1, slope));
  const startX = -overhang - leadingReach;
  const foldX = foldWidth - overhang;
  const endX = width + strokeWidth;
  const centerY = height / 2;
  const startY = centerY - (foldX - startX) * slope;
  const x = (value: number) => (mirrored ? width - value : value);
  const lateralLength = Math.hypot(foldX - startX, centerY - startY);
  const horizontalLength = endX - foldX;

  return {
    path: `M ${x(startX)} ${startY} L ${x(foldX)} ${centerY} L ${x(endX)} ${centerY}`,
    length: lateralLength + horizontalLength,
    horizontalLength,
    visibleLength: width - foldX,
    strokeWidth,
    bounds: {
      x: -strokeWidth,
      y: -foldRise - strokeWidth,
      width: width + strokeWidth * 2,
      height: height + foldRise + strokeWidth * 2,
    },
  };
}

export function ribbonRevealEase(
  time: number,
  geometry: ReturnType<typeof ribbonRevealGeometry>,
) {
  const progress = 1 - (1 - time) ** 3;
  const tip = geometry.visibleLength / geometry.horizontalLength;
  const brakeSpan = Math.min(
    8 / geometry.horizontalLength,
    tip / 2,
    (1 - tip) / 2,
  );
  const brakeStart = tip - brakeSpan;
  const brakeEnd = tip + brakeSpan;
  if (progress <= brakeStart) return progress;

  if (progress < brakeEnd) {
    const local = (progress - brakeStart) / (2 * brakeSpan);
    return brakeStart + brakeSpan * local * (2 - local);
  }

  // Resume only beyond the visible tip to finish the original shadow extension.
  const tail = (progress - brakeEnd) / (1 - brakeEnd);
  return tip + (1 - tip) * tail ** 2 * (3 - 2 * tail);
}

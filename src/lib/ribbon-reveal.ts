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
    strokeWidth,
    bounds: {
      x: -strokeWidth,
      y: -foldRise - strokeWidth,
      width: width + strokeWidth * 2,
      height: height + foldRise + strokeWidth * 2,
    },
  };
}

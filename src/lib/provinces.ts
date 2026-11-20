import catalogue from '../../content/geography/provinces.json' with { type: 'json' };

export const provinces = [...catalogue].sort((a, b) =>
  a.name.localeCompare(b.name, 'es'),
);
export const DEFAULT_PROVINCE = '28';
export type Province = (typeof provinces)[number];
export function provinceById(id: string) {
  return provinces.find((province) => province.id === id);
}
export function normalizeProvinceName(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es');
}
export function searchProvinces(value: string) {
  const query = normalizeProvinceName(value);
  return provinces.filter((province) =>
    [province.name, ...province.aliases].some((name) =>
      normalizeProvinceName(name).includes(query),
    ),
  );
}
export function matchProvince(value: string) {
  const query = normalizeProvinceName(value);
  return provinces.find((province) =>
    [province.name, ...province.aliases].some(
      (name) => normalizeProvinceName(name) === query,
    ),
  );
}

type Coordinate = [number, number];
type Ring = Coordinate[];
export type ProvinceBoundaries = {
  schemaVersion: number;
  provinces: {
    id: string;
    bounds: [number, number, number, number];
    polygons: Ring[][];
  }[];
};
function inRing(x: number, y: number, ring: Ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]!;
    const [xj, yj] = ring[j]!;
    const cross = (x - xi) * (yj - yi) - (y - yi) * (xj - xi);
    // Include actual ring edges, but never an enclosing bounding rectangle.
    if (
      Math.abs(cross) < 1e-12 &&
      x >= Math.min(xi, xj) &&
      x <= Math.max(xi, xj) &&
      y >= Math.min(yi, yj) &&
      y <= Math.max(yi, yj)
    )
      return true;
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}
export function provinceAtCoordinates(
  boundaries: ProvinceBoundaries,
  longitude: number,
  latitude: number,
) {
  if (
    !Number.isFinite(longitude) ||
    !Number.isFinite(latitude) ||
    Math.abs(longitude) > 180 ||
    Math.abs(latitude) > 90 ||
    boundaries.schemaVersion !== 1
  )
    return undefined;
  for (const province of boundaries.provinces) {
    if (!provinceById(province.id)) continue;
    const [west, south, east, north] = province.bounds;
    if (
      longitude < west ||
      longitude > east ||
      latitude < south ||
      latitude > north
    )
      continue;
    if (
      province.polygons.some(
        ([outer, ...holes]) =>
          outer &&
          inRing(longitude, latitude, outer) &&
          !holes.some((hole) => inRing(longitude, latitude, hole)),
      )
    )
      return province.id;
  }
  return undefined;
}

type LocationDependencies = {
  locate: () => Promise<{ longitude: number; latitude: number }>;
  boundaries: () => Promise<ProvinceBoundaries>;
  readManual: () => string | null;
  writeManual: (id: string) => void;
};
export function createProvinceStore(dependencies: LocationDependencies) {
  let selected = DEFAULT_PROVINCE;
  let initialized = false;
  let generation = 0;
  const listeners = new Set<() => void>();
  const update = (id: string) => {
    if (id === selected) return;
    selected = id;
    listeners.forEach((listener) => listener());
  };
  return {
    getSnapshot: () => selected,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    select(id: string) {
      if (!provinceById(id)) return;
      generation++;
      update(id);
      try {
        dependencies.writeManual(id);
      } catch {
        /* Storage is optional. */
      }
    },
    async initialize() {
      if (initialized || generation > 0) return;
      initialized = true;
      const request = generation;
      try {
        const saved = dependencies.readManual();
        if (saved && provinceById(saved)) {
          update(saved);
          return;
        }
      } catch {
        /* Private browsing can deny session storage. */
      }
      try {
        const position = await dependencies.locate();
        if (request !== generation) return;
        const boundaries = await dependencies.boundaries();
        if (request === generation)
          update(
            provinceAtCoordinates(
              boundaries,
              position.longitude,
              position.latitude,
            ) ?? DEFAULT_PROVINCE,
          );
      } catch {
        if (request === generation) update(DEFAULT_PROVINCE);
      }
    },
  };
}

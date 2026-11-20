'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { provincialPartyEntries } from '../lib/provincial-parties';
import {
  createProvinceStore,
  DEFAULT_PROVINCE,
  provinceById,
  type ProvinceBoundaries,
} from '../lib/provinces';

export const provinceStore = createProvinceStore({
  locate: () =>
    new Promise((resolve, reject) => {
      if (!window.isSecureContext || !navigator.geolocation) {
        reject(new Error('Geolocation unavailable'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>
          resolve({ longitude: coords.longitude, latitude: coords.latitude }),
        reject,
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
      );
    }),
  boundaries: async () => {
    const response = await fetch('/geography/provinces.json', {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Province boundaries unavailable');
    return (await response.json()) as ProvinceBoundaries;
  },
  readManual: () => sessionStorage.getItem('prisma-province'),
  writeManual: (id) => sessionStorage.setItem('prisma-province', id),
});

export function useProvince() {
  const id = useSyncExternalStore(
    provinceStore.subscribe,
    provinceStore.getSnapshot,
    () => DEFAULT_PROVINCE,
  );
  return provinceById(id)!;
}

export function useProvincialParties(
  programmes: { href: string; disabled?: boolean }[],
  topicId?: string,
) {
  const province = useProvince();
  useEffect(() => {
    void provinceStore.initialize();
  }, []);
  return useMemo(
    () => provincialPartyEntries(province.id, programmes, topicId),
    [province.id, programmes, topicId],
  );
}

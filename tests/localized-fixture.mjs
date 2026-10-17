import { locales } from '../src/lib/locales.mjs';

// Deliberately distinct synthetic strings make accidental Spanish fallbacks observable.
export const localizedFixture = (value) =>
  Object.fromEntries(
    locales.map((locale) => [
      locale,
      locale === 'es' ? value : `${locale}: ${value}`,
    ]),
  );

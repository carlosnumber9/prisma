// Shared with the offline generator; this module has no runtime dependencies.
export const locales = /** @type {const} */ ([
  'es',
  'ca',
  'gl',
  'eu',
  'oc',
  'en',
]);
/** @typedef {typeof locales[number]} Locale */

/** @param {unknown} value @returns {value is Locale} */
export function isLocale(value) {
  return (
    typeof value === 'string' && locales.some((locale) => locale === value)
  );
}

import messages from './messages.json' with { type: 'json' };
import { isLocale, locales, type Locale } from './locales.mjs';
export { isLocale, locales };
export type { Locale };
export type Messages = { [Key in keyof typeof messages.es]: string };
export const dictionaries: Record<Locale, Messages> = messages;
export const languageNames: Record<Locale, string> = {
  es: 'Castellano',
  ca: 'Català / Valencià',
  gl: 'Galego',
  eu: 'Euskara',
  oc: 'Aranés',
  en: 'English',
};
export const LANGUAGE_COOKIE = 'prisma-locale';
export const LANGUAGE_MAX_AGE = 60 * 60 * 24 * 365;

export function text(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    String(values[key] ?? match),
  );
}
export function localizedPath(path: string, locale: Locale) {
  return `/${locale}${path === '/' ? '' : path}`;
}
export function languagePath(path: string, locale: Locale) {
  const parts = path.split('/');
  if (isLocale(parts[1])) parts.splice(1, 1);
  return localizedPath(parts.join('/') || '/', locale);
}
export function selectionCookie(locale: Locale, secure: boolean) {
  return `${LANGUAGE_COOKIE}=${locale}; Path=/; Max-Age=${LANGUAGE_MAX_AGE}; SameSite=Lax${secure ? '; Secure' : ''}`;
}
export function languageSelection(href: string, locale: Locale) {
  const url = new URL(href);
  url.pathname = languagePath(url.pathname, locale);
  return {
    href: url.href,
    cookie: selectionCookie(locale, url.protocol === 'https:'),
  };
}

// Headers expose the browser's language preferences, not direct OS settings.
export function negotiateLocale(
  header: string | null,
  cookie?: string,
): Locale {
  if (isLocale(cookie)) return cookie;
  const preferences = (header ?? '')
    .split(',')
    .map((entry, index) => {
      const [tag = '', ...parameters] = entry.trim().toLowerCase().split(';');
      const quality = parameters.find((parameter) =>
        parameter.trim().startsWith('q='),
      );
      const raw = quality?.trim().slice(2);
      const q =
        raw === undefined
          ? 1
          : /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(raw)
            ? Number(raw)
            : 0;
      return { tag, q, index };
    })
    .filter(({ q }) => q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);
  for (const { tag } of preferences) {
    if (!/^[a-z]{2,3}(?:-[a-z0-9]{1,8})*$/.test(tag)) continue;
    const language = tag.split('-')[0];
    if (isLocale(language)) return language;
  }
  return 'es';
}

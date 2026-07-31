import { defineI18n } from "fumadocs-core/i18n"

export const i18n = defineI18n({
  defaultLanguage: "en",
  languages: ["en", "ko"],
  hideLocale: "default-locale",
})

export type Locale = (typeof i18n.languages)[number]

export function resolveLocale(lang: string): Locale {
  return i18n.languages.includes(lang as Locale)
    ? (lang as Locale)
    : i18n.defaultLanguage
}

/** Prefix a pathname with the locale, omitting the default locale. */
export function localizeHref(lang: string, path: string): string {
  const locale = resolveLocale(lang)
  if (locale === i18n.defaultLanguage) return path
  return path === "/" ? `/${locale}` : `/${locale}${path}`
}

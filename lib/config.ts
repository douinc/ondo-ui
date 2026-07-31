import { getDictionary } from "@/lib/dictionaries"
import { localizeHref } from "@/lib/i18n"

export const siteConfig = {
  name: "ondo/ui",
  url: "https://ui.ondo.dou.so",
  description: "Warm, trustworthy UI components for every generation.",
  links: {
    github: "https://github.com/douinc/ondo-ui",
  },
  githubRepo: "douinc/ondo-ui",
}

export type NavItem = { href: string; label: string }

/** Localized top navigation. The first item is always Home. */
export function getNavItems(lang: string): NavItem[] {
  const dict = getDictionary(lang)

  return [
    { href: localizeHref(lang, "/"), label: dict.nav.home },
    { href: localizeHref(lang, "/docs"), label: dict.nav.docs },
    { href: localizeHref(lang, "/components"), label: dict.nav.components },
    { href: localizeHref(lang, "/compositions"), label: dict.nav.compositions },
    { href: localizeHref(lang, "/blocks"), label: dict.nav.blocks },
    { href: localizeHref(lang, "/colors"), label: dict.nav.colors },
  ]
}

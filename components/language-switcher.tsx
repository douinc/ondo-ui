"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconLanguage } from "@tabler/icons-react"

import { i18n, type Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ko: "한국어",
}

/** Swap (or strip) the locale prefix on the current pathname. */
function localizePathname(pathname: string, locale: Locale) {
  const segments = pathname.split("/")
  const hasLocale = (i18n.languages as readonly string[]).includes(segments[1])
  const rest = (hasLocale ? segments.slice(2) : segments.slice(1)).join("/")
  const path = rest ? `/${rest}` : "/"

  if (locale === i18n.defaultLanguage) return path
  return path === "/" ? `/${locale}` : `/${locale}${path}`
}

export function LanguageSwitcher({
  lang,
  label,
}: {
  lang: string
  label: string
}) {
  const pathname = usePathname()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="extend-touch-target size-8"
          />
        }
      >
        <IconLanguage className="size-4.5" />
        <span className="sr-only">{label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.languages.map((locale) => (
          <DropdownMenuItem
            key={locale}
            data-active={locale === lang}
            className="data-[active=true]:bg-accent"
            render={<Link href={localizePathname(pathname, locale)} />}
          >
            {LOCALE_LABELS[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

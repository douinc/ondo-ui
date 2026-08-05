"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { BLOCK_CATEGORIES } from "@/lib/blocks"
import { getDictionary } from "@/lib/dictionaries"
import { localizeHref, type Locale } from "@/lib/i18n"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export function BlocksNav({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const dict = getDictionary(locale)
  const featuredHref = localizeHref(locale, "/blocks")

  return (
    <div className="relative overflow-hidden">
      <ScrollArea className="max-w-none">
        <nav
          aria-label={dict.blocks.title}
          className="flex min-w-max items-center"
        >
          <BlocksNavLink
            href={featuredHref}
            label={dict.blocks.featured}
            isActive={matchesPath(pathname, featuredHref)}
          />
          {BLOCK_CATEGORIES.map((category) => {
            const href = localizeHref(locale, `/blocks/${category.slug}`)

            return (
              <BlocksNavLink
                key={category.slug}
                href={href}
                label={category.name[locale]}
                isActive={matchesPath(pathname, href)}
              />
            )
          })}
        </nav>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  )
}

function BlocksNavLink({
  href,
  label,
  isActive,
}: {
  href: string
  label: string
  isActive: boolean
}) {
  return (
    <Link
      href={href}
      data-active={isActive}
      className="flex h-9 items-center justify-center border-b-2 border-transparent px-4 text-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:border-foreground data-[active=true]:text-foreground"
    >
      {label}
    </Link>
  )
}

function matchesPath(pathname: string, href: string) {
  return pathname === href || pathname === `${href}/`
}

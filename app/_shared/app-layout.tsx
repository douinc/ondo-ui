import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import type { Locale } from "@/lib/i18n"

export function AppLayout({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode
  locale: Locale
}>): React.ReactNode {
  return (
    <div
      data-slot="layout"
      className="group/layout relative z-10 flex min-h-svh flex-col bg-background"
    >
      <SiteHeader lang={locale} />
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <SiteFooter lang={locale} />
    </div>
  )
}

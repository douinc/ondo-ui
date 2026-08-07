import type { Metadata } from "next"

import { DesignInspectorMount } from "@/app/_shared/design-inspector-mount"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"
import { DOCS_SIDEBAR_SCROLL_RESTORE_SCRIPT } from "@/lib/docs"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function getRootMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: {
      default: "ondo/ui",
      template: "%s - ondo/ui",
    },
    description: dict.home.description,
    appleWebApp: {
      title: "Ondo UI",
    },
  }
}

export function LocaleRootLayout({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode
  locale: Locale
}>): React.ReactNode {
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        "[--header-height:calc(var(--spacing)*14)] lg:[--header-height:calc(var(--spacing)*16)]"
      )}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: DOCS_SIDEBAR_SCROLL_RESTORE_SCRIPT,
          }}
        />
      </head>
      <body className="group/body overscroll-none [--footer-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)]">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster />
          {process.env.NODE_ENV !== "production" ? (
            <DesignInspectorMount locale={locale} />
          ) : null}
        </ThemeProvider>
      </body>
    </html>
  )
}

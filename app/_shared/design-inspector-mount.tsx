"use client"

import { DesignInspector, type InspectorTheme } from "@dou.so/design-inspector"
import { useTheme } from "next-themes"

import type { Locale } from "@/lib/i18n"

function asInspectorTheme(value: string | undefined): InspectorTheme | undefined {
  return value === "system" || value === "light" || value === "dark"
    ? value
    : undefined
}

export function DesignInspectorMount({ locale }: { locale: Locale }) {
  const { setTheme, theme } = useTheme()

  return (
    <DesignInspector
      locale={locale}
      defaultTheme={asInspectorTheme(theme)}
      onThemeChange={(nextTheme) => setTheme(nextTheme)}
    />
  )
}

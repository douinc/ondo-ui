import type { Metadata } from "next"

import { ColorPalette } from "@/components/color-palette"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"

export function getColorsMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: dict.colors.title,
    description: dict.colors.description,
  }
}

export function ColorsPage({ locale }: { locale: Locale }): React.ReactNode {
  const dict = getDictionary(locale)

  return (
    <main className="container mx-auto flex-1 px-6 py-12">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {dict.colors.title}
        </h1>
        <p className="max-w-2xl text-balance text-muted-foreground">
          {dict.colors.description}
        </p>
      </div>
      <ColorPalette
        copiedLabel={dict.colors.copied}
        customLabel={dict.colors.custom}
        fieldsLabel={dict.colors.fields}
      />
    </main>
  )
}

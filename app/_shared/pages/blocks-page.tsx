import type { Metadata } from "next"

import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"

export function getBlocksMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: dict.blocks.title,
    description: dict.blocks.description,
  }
}

export function BlocksPage({ locale }: { locale: Locale }): React.ReactNode {
  const dict = getDictionary(locale)

  return (
    <main className="container mx-auto flex-1 px-6 py-12">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {dict.blocks.title}
        </h1>
        <p className="max-w-2xl text-balance text-muted-foreground">
          {dict.blocks.description}
        </p>
      </div>
      <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed p-12 text-center">
        <p className="font-heading font-semibold">{dict.blocks.comingSoon}</p>
        <p className="max-w-md text-balance text-sm text-muted-foreground">
          {dict.blocks.comingSoonDescription}
        </p>
      </div>
    </main>
  )
}

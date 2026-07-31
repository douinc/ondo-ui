import type { Metadata } from "next"
import Link from "next/link"

import { compositionsList } from "@/lib/compositions-list"
import { getDictionary } from "@/lib/dictionaries"
import { localizeHref, type Locale } from "@/lib/i18n"

export function getCompositionsMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: dict.compositions.title,
    description: dict.compositions.description,
  }
}

export function CompositionsPage({
  locale,
}: {
  locale: Locale
}): React.ReactNode {
  const dict = getDictionary(locale)

  return (
    <main className="container mx-auto flex-1 px-6 py-12">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {dict.compositions.title}
        </h1>
        <p className="max-w-2xl text-balance text-muted-foreground">
          {dict.compositions.description}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {compositionsList.map((composition) => (
          <Link
            key={composition.name}
            href={localizeHref(
              locale,
              `/docs/compositions/${composition.name}`
            )}
            className="flex flex-col gap-1.5 rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
          >
            <h2 className="font-heading font-semibold">{composition.title}</h2>
            <p className="text-sm text-muted-foreground">
              {composition.description[locale]}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}

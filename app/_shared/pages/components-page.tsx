import type { Metadata } from "next"
import Link from "next/link"

import { componentsList } from "@/lib/components-list"
import { getDictionary } from "@/lib/dictionaries"
import { localizeHref, type Locale } from "@/lib/i18n"

export function getComponentsMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: dict.components.title,
    description: dict.components.description,
  }
}

export function ComponentsPage({
  locale,
}: {
  locale: Locale
}): React.ReactNode {
  const dict = getDictionary(locale)

  return (
    <main className="container mx-auto flex-1 px-6 py-12">
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {dict.components.title}
        </h1>
        <p className="max-w-2xl text-balance text-muted-foreground">
          {dict.components.description}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {componentsList.map((component) => (
          <Link
            key={component.name}
            href={localizeHref(
              locale,
              `/docs/components/${component.name}`
            )}
            className="flex flex-col gap-1.5 rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
          >
            <h2 className="font-heading font-semibold">{component.title}</h2>
            <p className="text-sm text-muted-foreground">
              {component.description[locale]}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}

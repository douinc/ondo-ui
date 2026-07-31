import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/dictionaries"
import { localizeHref, type Locale } from "@/lib/i18n"

export function HomePage({ locale }: { locale: Locale }): React.ReactNode {
  const dict = getDictionary(locale)

  return (
    <main className="container mx-auto flex flex-1 flex-col px-6">
      <section className="flex flex-col items-center gap-6 py-16 text-center md:py-24">
        <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight md:text-5xl">
          {dict.home.title}
        </h1>
        <p className="max-w-2xl whitespace-pre-line text-lg text-muted-foreground">
          {dict.home.description}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            size="lg"
            nativeButton={false}
            render={<Link href={localizeHref(locale, "/docs")} />}
          >
            {dict.home.getStarted}
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href={localizeHref(locale, "/components")} />}
          >
            {dict.home.viewComponents}
          </Button>
        </div>
      </section>

      <section className="grid gap-4 pb-16 md:grid-cols-3">
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-6">
          <h2 className="font-heading font-semibold">
            {dict.home.cards.whoTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dict.home.cards.whoDescription}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-6">
          <h2 className="font-heading font-semibold">
            {dict.home.cards.whereTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dict.home.cards.whereDescription}
          </p>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border bg-card p-6">
          <h2 className="font-heading font-semibold">
            {dict.home.cards.whyTitle}
          </h2>
          <p className="text-sm text-muted-foreground">
            {dict.home.cards.whyDescription}
          </p>
        </div>
      </section>
    </main>
  )
}

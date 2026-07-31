import type { Metadata } from "next"

import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { source } from "@/lib/source"
import { getMdxComponents } from "@/mdx-components"

export function getChangelogMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: dict.changelog.title,
    description: dict.changelog.description,
  }
}

function formatDate(iso: string, locale: Locale) {
  const date = new Date(`${iso}T00:00:00`)
  return new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

// Two releases can land on the same day, so the filename date alone does not
// order them. Compare the date first, then the version numerically -- a string
// compare would put v10 below v9.
function compareVersions(a: string | undefined, b: string | undefined) {
  const pa = (a ?? "0.0.0").split(".").map(Number)
  const pb = (b ?? "0.0.0").split(".").map(Number)

  for (let i = 0; i < 3; i++) {
    if (pa[i] !== pb[i]) {
      return (pb[i] ?? 0) - (pa[i] ?? 0)
    }
  }

  return 0
}

export async function ChangelogPage({
  locale,
}: {
  locale: Locale
}): Promise<React.ReactNode> {
  const dict = getDictionary(locale)
  const entries = source
    .getPages(locale)
    .filter((page) => page.slugs[0] === "changelog" && page.slugs.length > 1)
    .sort((a, b) => {
      const byDate = b.slugs
        .at(-1)!
        .slice(0, 10)
        .localeCompare(a.slugs.at(-1)!.slice(0, 10))
      return byDate !== 0
        ? byDate
        : compareVersions(a.data.version, b.data.version)
    })

  return (
    <div
      data-slot="docs"
      className="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-160 min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:py-8">
          <div className="flex flex-col gap-2">
            <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">
              {dict.changelog.title}
            </h1>
            <p className="text-balance text-[1.05rem] text-muted-foreground sm:text-base md:max-w-[80%]">
              {dict.changelog.description}
            </p>
          </div>
          <div className="flex flex-1 flex-col gap-12 pb-16">
            {entries.map((entry) => {
              const MDX = entry.data.body
              const match = entry.slugs.at(-1)!.match(/^(\d{4}-\d{2}-\d{2})/)
              const date = match ? formatDate(match[1], locale) : null

              return (
                <section
                  key={entry.url}
                  className="flex flex-col gap-2 border-t border-dashed pt-8 first:border-t-0 first:pt-0"
                >
                  {date && (
                    <time className="text-sm text-muted-foreground">
                      {date}
                    </time>
                  )}
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {entry.data.title}
                  </h2>
                  {entry.data.description && (
                    <p className="text-balance text-muted-foreground">
                      {entry.data.description}
                    </p>
                  )}
                  <div className="typeset typeset-docs mt-2 w-full">
                    <MDX components={getMdxComponents(locale)} />
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

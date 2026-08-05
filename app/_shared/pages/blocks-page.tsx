import type { Metadata } from "next"
import Link from "next/link"

import registry from "@/registry.json"

import { FEATURED_BLOCK_NAMES, listBlockItems } from "@/lib/blocks"
import { getDictionary } from "@/lib/dictionaries"
import { localizeHref, type Locale } from "@/lib/i18n"
import { BlockDisplay } from "@/components/block-display"
import { BlocksNav } from "@/components/blocks-nav"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

export function getBlocksMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale)

  return {
    title: dict.blocks.title,
    description: dict.blocks.description,
  }
}

export async function BlocksPage({
  locale,
  category,
}: {
  locale: Locale
  category?: string
}): Promise<React.ReactNode> {
  const dict = getDictionary(locale)
  const blocks = category
    ? listBlockItems(registry.items, category)
    : listBlockItems(registry.items).filter((item) =>
        FEATURED_BLOCK_NAMES.some((name) => name === item.name)
      )

  return (
    <main className="flex-1 py-10 md:py-14">
      <div className="container mx-auto flex max-w-[1600px] flex-col gap-10 px-4 md:px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Heading level={1} size={2} wrap="balance">
            {dict.blocks.title}
          </Heading>
          <p className="text-balance text-muted-foreground">
            {dict.blocks.description}
          </p>
          <Button
            variant="outline"
            render={<Link href={localizeHref(locale, "/components")} />}
          >
            {dict.blocks.browseComponents}
          </Button>
        </div>

        <div>
          <BlocksNav locale={locale} />
          <Separator />
        </div>

        {blocks.length > 0 ? (
          <div className="flex min-w-0 flex-col gap-12 md:gap-24">
            {blocks.map((block) => (
              <BlockDisplay
                key={block.name}
                name={block.name}
                locale={locale}
              />
            ))}
          </div>
        ) : category ? (
          <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed p-12 text-center">
            <p className="max-w-md text-sm text-muted-foreground">
              {dict.blocks.emptyCategory}
            </p>
          </div>
        ) : null}
      </div>
    </main>
  )
}

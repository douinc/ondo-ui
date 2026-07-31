import type { Metadata } from "next"
import { notFound } from "next/navigation"

import type { Locale } from "@/lib/i18n"
import { source } from "@/lib/source"

export function getDocsStaticParams(
  locale: Locale
): Array<{ slug: string[] }> {
  return source.getPages(locale).map((page) => ({ slug: page.slugs }))
}

export async function getDocsMetadata(
  locale: Locale,
  slug: string[] | undefined
): Promise<Metadata> {
  const page = source.getPage(slug, locale)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

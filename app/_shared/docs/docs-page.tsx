import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { findNeighbour } from "fumadocs-core/page-tree"
import Link from "next/link"
import { notFound } from "next/navigation"

import { DocsCopyPage } from "@/components/docs-copy-page"
import { DocsCta } from "@/components/docs-cta"
import { DocsTableOfContents } from "@/components/docs-toc"
import { buttonVariants } from "@/components/ui/button"
import { getDictionary } from "@/lib/dictionaries"
import type { Locale } from "@/lib/i18n"
import { source } from "@/lib/source"
import { cn } from "@/lib/utils"
import { getMdxComponents } from "@/mdx-components"

export async function DocsPage({
  locale,
  slug,
}: {
  locale: Locale
  slug: string[] | undefined
}): Promise<React.ReactNode> {
  const page = source.getPage(slug, locale)
  if (!page) notFound()

  const dict = getDictionary(locale)
  const doc = page.data
  const MDX = doc.body
  const neighbours = findNeighbour(source.getPageTree(locale), page.url)
  const raw = await doc.getText("raw")

  return (
    <div
      data-slot="docs"
      className="flex scroll-mt-24 items-stretch pb-8 text-[1.05rem] sm:text-[15px] xl:w-full"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="h-(--top-spacing) shrink-0" />
        <div className="mx-auto flex w-full max-w-160 min-w-0 flex-1 flex-col gap-6 px-4 py-6 text-foreground md:px-0 lg:py-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between md:items-start">
              <h1 className="scroll-m-24 text-3xl font-semibold tracking-tight sm:text-3xl">
                {doc.title}
              </h1>
              <div className="docs-nav flex items-center gap-2">
                <div className="hidden sm:block">
                  <DocsCopyPage page={raw} url={page.url} dict={dict.docs} />
                </div>
                <div className="ml-auto flex gap-2">
                  {neighbours.previous && (
                    <Link
                      href={neighbours.previous.url}
                      className={cn(
                        buttonVariants({ variant: "secondary", size: "icon" }),
                        "extend-touch-target size-8 shadow-none md:size-7"
                      )}
                    >
                      <IconArrowLeft />
                      <span className="sr-only">{dict.docs.previous}</span>
                    </Link>
                  )}
                  {neighbours.next && (
                    <Link
                      href={neighbours.next.url}
                      className={cn(
                        buttonVariants({ variant: "secondary", size: "icon" }),
                        "extend-touch-target size-8 shadow-none md:size-7"
                      )}
                    >
                      <span className="sr-only">{dict.docs.next}</span>
                      <IconArrowRight />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {doc.description && (
              <p className="text-balance text-[1.05rem] text-muted-foreground sm:text-base md:max-w-[80%]">
                {doc.description}
              </p>
            )}
          </div>
          <div className="typeset typeset-docs w-full flex-1 pb-16 *:data-[slot=alert]:first:mt-0 sm:pb-0">
            <MDX components={getMdxComponents(locale)} />
          </div>
          <div className="hidden h-16 w-full items-center gap-2 px-4 sm:flex sm:px-0">
            {neighbours.previous && (
              <Link
                href={neighbours.previous.url}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "shadow-none"
                )}
              >
                <IconArrowLeft /> {neighbours.previous.name}
              </Link>
            )}
            {neighbours.next && (
              <Link
                href={neighbours.next.url}
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "ml-auto shadow-none"
                )}
              >
                {neighbours.next.name} <IconArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="sticky top-[calc(var(--header-height)+1px)] z-30 ml-auto hidden h-[90svh] w-(--sidebar-width) flex-col gap-4 overflow-hidden overscroll-none pb-8 xl:flex">
        <div className="h-(--top-spacing) shrink-0"></div>
        {doc.toc?.length ? (
          <div className="scroll-fade scrollbar-none flex flex-col gap-8 overflow-y-auto px-8">
            <DocsTableOfContents toc={doc.toc} label={dict.docs.onThisPage} />
          </div>
        ) : null}
        <div className="hidden flex-1 flex-col gap-6 px-6 xl:flex">
          <DocsCta dict={dict.docs} />
        </div>
      </div>
    </div>
  )
}

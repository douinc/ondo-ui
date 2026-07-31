import { siteConfig } from "@/lib/config"
import { getDictionary } from "@/lib/dictionaries"

export function SiteFooter({ lang }: { lang: string }) {
  const dict = getDictionary(lang)

  return (
    <footer className="group-has-[[data-slot=docs]]/body:hidden dark:bg-transparent">
      <div className="container-wrapper px-4 xl:px-6">
        <div className="flex h-(--footer-height) items-center justify-between">
          <div className="w-full px-1 text-center text-xs leading-loose text-muted-foreground sm:text-sm">
            {dict.footer.p1}
            <a
              href="https://dou.so"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {dict.footer.dou}
            </a>
            {dict.footer.p2}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              {dict.footer.gh}
            </a>
            {dict.footer.p3}
          </div>
        </div>
      </div>
    </footer>
  )
}

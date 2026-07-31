import { getNavItems } from "@/lib/config"
import { getDictionary } from "@/lib/dictionaries"
import { source } from "@/lib/source"
import { CommandMenu } from "@/components/command-menu"
import { GitHubLink } from "@/components/github-link"
import { LanguageSwitcher } from "@/components/language-switcher"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeSwitcher } from "@/components/mode-switcher"
import { Separator } from "@/components/ui/separator"

export function SiteHeader({ lang }: { lang: string }) {
  const dict = getDictionary(lang)
  const navItems = getNavItems(lang)
  const [home, ...items] = navItems
  const pageTree = source.getPageTree(lang)

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="container-wrapper px-6">
        <div className="flex h-(--header-height) items-center **:data-[slot=separator]:h-4! **:data-[slot=separator]:self-center!">
          <MobileNav
            tree={pageTree}
            items={navItems}
            menuLabel={dict.header.menu}
            toggleLabel={dict.header.toggleMenu}
            className="flex lg:hidden"
          />
          <MainNav home={home} items={items} className="hidden lg:flex" />
          <div className="ml-auto flex items-center gap-2 md:flex-1 md:justify-end">
            <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
              <CommandMenu
                tree={pageTree}
                lang={lang}
                dict={dict}
                navItems={navItems}
              />
            </div>
            <Separator
              orientation="vertical"
              className="ml-2 hidden lg:block"
            />
            <GitHubLink />
            <Separator orientation="vertical" />
            <ModeSwitcher label={dict.header.toggleTheme} />
            <Separator orientation="vertical" />
            <LanguageSwitcher lang={lang} label={dict.header.changeLanguage} />
          </div>
        </div>
      </div>
    </header>
  )
}

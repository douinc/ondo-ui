"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type * as PageTree from "fumadocs-core/page-tree"

import { DOCS_SIDEBAR_SCROLL_STORAGE_KEY, PAGES_NEW } from "@/lib/docs"
import { getSidebarGroups } from "@/lib/page-tree"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

function readScrollState() {
  try {
    return JSON.parse(
      sessionStorage.getItem(DOCS_SIDEBAR_SCROLL_STORAGE_KEY) ?? ""
    ) as {
      pathname: string
      scrollTop: number
    }
  } catch {
    return null
  }
}

function saveScrollState(container: HTMLElement) {
  try {
    sessionStorage.setItem(
      DOCS_SIDEBAR_SCROLL_STORAGE_KEY,
      JSON.stringify({
        pathname: location.pathname,
        scrollTop: container.scrollTop,
      })
    )
  } catch {}
}

function getActiveItem(container: HTMLElement) {
  const items = container.querySelectorAll<HTMLElement>('[data-active="true"]')
  let active: HTMLElement | null = null
  let activePathLength = -1
  let activeDistance = Infinity
  const containerRect = container.getBoundingClientRect()
  const containerCenter = containerRect.top + container.clientHeight / 2

  for (const item of items) {
    const link = item.querySelector<HTMLAnchorElement>("a[href]")
    const href = item.getAttribute("href") ?? link?.getAttribute("href")
    const pathLength = href?.length ?? 0
    const itemRect = item.getBoundingClientRect()
    const distance = Math.abs(
      itemRect.top + itemRect.height / 2 - containerCenter
    )

    if (
      pathLength > activePathLength ||
      (pathLength === activePathLength && distance < activeDistance)
    ) {
      active = item
      activePathLength = pathLength
      activeDistance = distance
    }
  }

  return active
}

export function DocsSidebar({
  tree,
  ...props
}: React.ComponentProps<typeof Sidebar> & { tree: PageTree.Root }) {
  const pathname = usePathname()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const groups = React.useMemo(() => getSidebarGroups(tree), [tree])

  React.useLayoutEffect(() => {
    const container = contentRef.current

    if (!container) {
      return
    }

    const scrollState = readScrollState()

    if (scrollState?.pathname === pathname) {
      container.scrollTop = scrollState.scrollTop
    } else {
      // Prefer the longest route because section links also match by prefix.
      // Equal routes keep the item closest to the current viewport.
      const active = getActiveItem(container)

      if (active) {
        const containerRect = container.getBoundingClientRect()
        const activeRect = active.getBoundingClientRect()

        if (
          activeRect.top < containerRect.top ||
          activeRect.bottom > containerRect.bottom
        ) {
          container.scrollTop +=
            activeRect.top -
            containerRect.top -
            (container.clientHeight - activeRect.height) / 2
        }
      }
    }

    saveScrollState(container)
  }, [pathname])

  React.useEffect(() => {
    const container = contentRef.current

    if (!container) {
      return
    }

    const onScroll = () => saveScrollState(container)
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <Sidebar
      className="sticky top-[calc(var(--header-height)+0.6rem)] z-30 hidden h-[calc(100svh-var(--header-height)-2rem)] overflow-hidden overscroll-none bg-transparent [--sidebar-menu-width:--spacing(56)] lg:flex"
      collapsible="none"
      {...props}
    >
      <div className="absolute top-12 right-2 bottom-0 hidden h-full w-px bg-[linear-gradient(to_bottom,transparent_0%,var(--border)_10%,var(--border)_90%,transparent_100%)] lg:flex" />
      <SidebarContent
        ref={contentRef}
        data-docs-sidebar-content=""
        className="w-(--sidebar-menu-width) scroll-fade scrollbar-none overflow-x-hidden pl-2.5"
      >
        {groups.map((group, index) => (
          <SidebarGroup key={index} className={index === 0 ? "pt-12" : ""}>
            <SidebarGroupLabel className="font-medium text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {group.pages.map((page) => (
                  <SidebarMenuItem key={page.url}>
                    <SidebarMenuButton
                      isActive={page.url === pathname}
                      className="relative h-[30px] w-fit overflow-visible border border-transparent text-[0.8rem] font-medium after:absolute after:inset-x-0 after:-inset-y-1 after:z-0 after:rounded-md data-[active=true]:border-accent data-[active=true]:bg-accent"
                      render={<Link href={page.url} />}
                    >
                      <span className="absolute inset-0 flex w-(--sidebar-menu-width) bg-transparent" />
                      {page.name}
                      {PAGES_NEW.includes(page.url) && (
                        <span
                          className="flex size-2 rounded-full bg-blue-500"
                          title="New"
                        />
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

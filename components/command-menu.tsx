"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"
import {
  IconArrowRight,
  IconCornerDownLeft,
  IconMoon,
  IconSun,
} from "@tabler/icons-react"
import { useDocsSearch } from "fumadocs-core/search/client"
import { oramaStaticClient } from "fumadocs-core/search/client/orama-static"
import type * as PageTree from "fumadocs-core/page-tree"
import { useTheme } from "next-themes"

import type { NavItem } from "@/lib/config"
import type { Dictionary } from "@/lib/dictionaries"
import { getSidebarGroups } from "@/lib/page-tree"
import { createStaticSearchIndex } from "@/lib/search-index"
import { TOKEN_GROUPS } from "@/lib/theme-tokens"
import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useMutationObserver } from "@/hooks/use-mutation-observer"
import { copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

function getAddCommand(
  packageManager: "npm" | "yarn" | "pnpm" | "bun",
  component: string
) {
  const runner =
    packageManager === "npm"
      ? "npx"
      : packageManager === "bun"
        ? "bunx --bun"
        : `${packageManager} dlx`
  return `${runner} shadcn@latest add @ondo-ui/${component}`
}

function resolveToken(token: string) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--${token}`)
    .trim()
}

export function CommandMenu({
  tree,
  lang,
  dict,
  navItems,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  tree: PageTree.Root
  lang: string
  dict: Dictionary
  navItems: NavItem[]
}) {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()
  const [config] = useConfig()
  const [open, setOpen] = React.useState(false)
  const [renderDelayedGroups, setRenderDelayedGroups] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<
    "color" | "page" | "component" | "theme" | null
  >(null)
  const [copyPayload, setCopyPayload] = React.useState("")

  const searchClient = React.useMemo(
    () =>
      oramaStaticClient({
        from: "/api/search",
        locale: lang,
        initOrama: createStaticSearchIndex,
      }),
    [lang]
  )

  const { search, setSearch, query } = useDocsSearch({
    client: searchClient,
  })

  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearchChange = React.useCallback(
    (value: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      searchTimeoutRef.current = setTimeout(() => {
        React.startTransition(() => {
          setSearch(value)
        })
      }, 300)
    },
    [setSearch]
  )

  const handleOpenChange = React.useCallback((nextOpen: boolean) => {
    setRenderDelayedGroups(false)
    setOpen(nextOpen)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => setRenderDelayedGroups(true))
    return () => cancelAnimationFrame(frame)
  }, [open])

  React.useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const commandFilter = React.useCallback(
    (value: string, searchValue: string, keywords?: string[]) => {
      const extendValue = value + " " + (keywords?.join(" ") || "")
      if (extendValue.toLowerCase().includes(searchValue.toLowerCase())) {
        return 1
      }
      return 0
    },
    []
  )

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      handleOpenChange(false)
      command()
    },
    [handleOpenChange]
  )

  const groups = React.useMemo(() => getSidebarGroups(tree), [tree])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }
        e.preventDefault()
        handleOpenChange(!open)
      }

      if (e.key === "c" && (e.metaKey || e.ctrlKey) && copyPayload) {
        runCommand(() => copyToClipboardWithMeta(copyPayload))
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [copyPayload, handleOpenChange, open, runCommand])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} {...props}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="relative h-8 w-full justify-start rounded-lg border-none bg-muted pl-3 font-normal text-muted-foreground shadow-none transition-colors hover:bg-muted/70 md:w-48 lg:w-40 xl:w-64 dark:bg-card"
          />
        }
      >
        <span className="hidden xl:inline-flex">{dict.search.placeholder}</span>
        <span className="inline-flex xl:hidden">
          {dict.search.placeholderShort}
        </span>
      </DialogTrigger>
      <CommandMenuPopup>
        <DialogHeader className="sr-only">
          <DialogTitle>{dict.search.title}</DialogTitle>
          <DialogDescription>{dict.search.description}</DialogDescription>
        </DialogHeader>
        <Command
          className="rounded-none bg-transparent p-0 **:data-[slot=command-input-wrapper]:m-1 **:data-[slot=command-input-wrapper]:mb-0"
          filter={commandFilter}
        >
          <div className="relative">
            <CommandInput
              placeholder={dict.search.placeholder}
              onValueChange={handleSearchChange}
            />
            {query.isLoading && (
              <div className="pointer-events-none absolute top-1/2 right-4 z-10 flex -translate-y-1/2 items-center justify-center">
                <Spinner className="size-4 text-muted-foreground" />
              </div>
            )}
          </div>
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="py-12 text-center text-sm text-muted-foreground">
              {query.isLoading ? dict.search.searching : dict.search.noResults}
            </CommandEmpty>
            <CommandGroup
              heading={dict.search.pagesHeading}
              className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
            >
              {navItems.map((item) => (
                <CommandMenuItem
                  key={item.href}
                  value={`Navigation ${item.label}`}
                  keywords={["nav", "navigation", item.label.toLowerCase()]}
                  onHighlight={() => {
                    setSelectedType("page")
                    setCopyPayload("")
                  }}
                  onSelect={() => runCommand(() => router.push(item.href))}
                >
                  <IconArrowRight />
                  {item.label}
                </CommandMenuItem>
              ))}
            </CommandGroup>
            {renderDelayedGroups ? (
              <>
                {groups.map((group, index) => (
                  <CommandGroup
                    key={index}
                    heading={group.label}
                    className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
                  >
                    {group.pages.map((item) => {
                      const isComponent = item.url.includes("/components/")

                      return (
                        <CommandMenuItem
                          key={item.url}
                          value={
                            item.name?.toString()
                              ? `${group.label} ${item.name}`
                              : ""
                          }
                          keywords={isComponent ? ["component"] : undefined}
                          onHighlight={() => {
                            if (isComponent) {
                              const componentName = item.url.split("/").pop()!
                              setSelectedType("component")
                              setCopyPayload(
                                getAddCommand(
                                  config.packageManager,
                                  componentName
                                )
                              )
                            } else {
                              setSelectedType("page")
                              setCopyPayload("")
                            }
                          }}
                          onSelect={() =>
                            runCommand(() => router.push(item.url))
                          }
                        >
                          {isComponent ? (
                            <div className="aspect-square size-4 rounded-full border border-dashed border-muted-foreground" />
                          ) : (
                            <IconArrowRight />
                          )}
                          {item.name}
                        </CommandMenuItem>
                      )
                    })}
                  </CommandGroup>
                ))}
                <CommandGroup
                  heading={dict.search.colorsHeading}
                  className="p-0! **:[[cmdk-group-heading]]:p-3!"
                >
                  {TOKEN_GROUPS.flatMap((group) => group.tokens).map(
                    (token) => (
                      <CommandMenuItem
                        key={token}
                        value={`--${token}`}
                        keywords={["color", "token", token]}
                        onHighlight={() => {
                          setSelectedType("color")
                          setCopyPayload(`var(--${token})`)
                        }}
                        onSelect={() =>
                          runCommand(() =>
                            copyToClipboardWithMeta(resolveToken(token))
                          )
                        }
                      >
                        <div
                          className="border-ghost aspect-square size-4 rounded-sm after:rounded-sm"
                          style={{ background: `var(--${token})` }}
                        />
                        --{token}
                      </CommandMenuItem>
                    )
                  )}
                </CommandGroup>
                <CommandGroup
                  heading={dict.search.themeHeading}
                  className="p-0! **:[[cmdk-group-heading]]:p-3!"
                >
                  <CommandMenuItem
                    value={`Theme ${dict.search.toggleDarkMode}`}
                    keywords={["theme", "dark", "light", "mode"]}
                    onHighlight={() => {
                      setSelectedType("theme")
                      setCopyPayload("")
                    }}
                    onSelect={() =>
                      runCommand(() =>
                        setTheme(resolvedTheme === "dark" ? "light" : "dark")
                      )
                    }
                  >
                    {resolvedTheme === "dark" ? <IconSun /> : <IconMoon />}
                    {dict.search.toggleDarkMode}
                  </CommandMenuItem>
                </CommandGroup>
                <SearchResults
                  setOpen={handleOpenChange}
                  query={query}
                  search={search}
                  heading={dict.search.resultsHeading}
                />
              </>
            ) : null}
          </CommandList>
        </Command>
        <div className="absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium text-muted-foreground dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <IconCornerDownLeft />
            </CommandMenuKbd>{" "}
            {selectedType === "page" || selectedType === "component"
              ? dict.search.goToPage
              : null}
            {selectedType === "color" ? dict.search.copyValue : null}
            {selectedType === "theme" ? dict.search.toggleDarkMode : null}
          </div>
          {copyPayload && (
            <>
              <Separator orientation="vertical" className="h-4! self-center!" />
              <div className="flex items-center gap-1">
                <CommandMenuKbd>⌘</CommandMenuKbd>
                <CommandMenuKbd>C</CommandMenuKbd>
                <span className="truncate">{copyPayload}</span>
              </div>
            </>
          )}
        </div>
      </CommandMenuPopup>
    </Dialog>
  )
}

/** Dialog popup pinned near the top, shadcn.com style. */
function CommandMenuPopup({
  className,
  children,
  ...props
}: BaseDialog.Popup.Props) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <BaseDialog.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-[15%] left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 gap-4 rounded-xl border-none bg-background bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 duration-100 outline-none sm:max-w-lg dark:bg-neutral-900 dark:ring-neutral-800",
          className
        )}
        {...props}
      >
        {children}
      </BaseDialog.Popup>
    </DialogPortal>
  )
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.()
      }
    })
  })

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "h-9 rounded-md border border-transparent px-3! font-medium data-[selected=true]:border-input data-[selected=true]:bg-input/50",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "pointer-events-none flex h-5 items-center justify-center gap-1 rounded border bg-background px-1 font-sans text-[0.7rem] font-medium text-muted-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

type Query = ReturnType<typeof useDocsSearch>["query"]

function SearchResults({
  setOpen,
  query,
  search,
  heading,
}: {
  setOpen: (open: boolean) => void
  query: Query
  search: string
  heading: string
}) {
  const router = useRouter()

  const uniqueResults = React.useMemo(() => {
    if (!query.data || !Array.isArray(query.data)) {
      return []
    }

    return query.data.filter(
      (item, index, self) =>
        !(
          item.type === "text" && item.content.trim().split(/\s+/).length <= 1
        ) && index === self.findIndex((t) => t.content === item.content)
    )
  }, [query.data])

  if (!search.trim() || !query.data || query.data === "empty") {
    return null
  }

  if (uniqueResults.length === 0) {
    return null
  }

  return (
    <CommandGroup
      className="px-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
      heading={heading}
    >
      {uniqueResults.map((item) => (
        <CommandItem
          key={item.id}
          data-type={item.type}
          onSelect={() => {
            router.push(item.url)
            setOpen(false)
          }}
          className="h-9 rounded-md border border-transparent px-3! font-normal data-[selected=true]:border-input data-[selected=true]:bg-input/50"
          keywords={[item.content]}
          value={`${item.content} ${item.type}`}
        >
          <div className="line-clamp-1 text-sm">{item.content}</div>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

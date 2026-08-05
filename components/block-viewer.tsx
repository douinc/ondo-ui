"use client"

import * as React from "react"
import Image from "next/image"
import {
  IconCheck,
  IconCode,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconExternalLink,
  IconFileCode,
  IconRefresh,
  IconTerminal2,
} from "@tabler/icons-react"
import type { PanelImperativeHandle } from "react-resizable-panels"

import type { BlockDisplayFile, BlockFileTreeNode } from "@/lib/block-source"
import {
  BLOCK_VIEWPORTS,
  getBlockInstallCommand,
  getBlockPreviewUrl,
  getBlockScreenshotUrl,
  type BlockItem,
  type BlockViewport,
} from "@/lib/blocks"
import { BlockViewerFileTree } from "@/components/block-viewer-file-tree"
import { CopyButton, copyToClipboardWithMeta } from "@/components/copy-button"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export type BlockViewerLabels = {
  preview: string
  code: string
  desktop: string
  tablet: string
  mobile: string
  openNewTab: string
  refresh: string
  files: string
  copyInstall: string
}

export function BlockViewer({
  item,
  labels,
  tree,
  files,
}: {
  item: BlockItem
  labels: BlockViewerLabels
  tree: readonly BlockFileTreeNode[]
  files: readonly BlockDisplayFile[]
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview")
  const [viewport, setViewport] = React.useState<BlockViewport>("desktop")
  const [activeFile, setActiveFile] = React.useState<string | null>(
    files[0]?.path ?? null
  )
  const [iframeKey, setIframeKey] = React.useState(0)
  const [installCopied, setInstallCopied] = React.useState(false)
  const previewPanelRef = React.useRef<PanelImperativeHandle>(null)
  const command = getBlockInstallCommand(item.name)
  const previewUrl = getBlockPreviewUrl(item.name)
  const activeSource =
    files.find((file) => file.path === activeFile) ?? files[0]

  React.useEffect(() => {
    if (!installCopied) return
    const timeout = window.setTimeout(() => setInstallCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [installCopied])

  function selectViewport(nextViewport: BlockViewport) {
    setView("preview")
    setViewport(nextViewport)
    previewPanelRef.current?.resize(BLOCK_VIEWPORTS[nextViewport])
  }

  return (
    <Tabs
      id={item.name}
      value={view}
      onValueChange={(value) => setView(value as "preview" | "code")}
      data-view={view}
      className="group/block-viewer min-w-0 scroll-mt-24 gap-4"
      style={
        {
          "--block-height": item.meta?.iframeHeight ?? "930px",
        } as React.CSSProperties
      }
    >
      <div className="hidden min-w-0 items-center gap-2 px-2 lg:flex">
        <TabsList className="h-8">
          <TabsTrigger value="preview">
            <IconDeviceDesktop />
            {labels.preview}
          </TabsTrigger>
          <TabsTrigger value="code">
            <IconCode />
            {labels.code}
          </TabsTrigger>
        </TabsList>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <a
          href={`#${item.name}`}
          className="min-w-0 flex-1 truncate text-sm font-medium hover:underline"
        >
          {item.description?.replace(/\.$/, "")}
        </a>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <ToggleGroup
            aria-label="Preview viewport"
            variant="outline"
            size="sm"
            spacing={0}
          >
            <ViewportToggle
              value="desktop"
              label={labels.desktop}
              active={viewport === "desktop"}
              onSelect={selectViewport}
            >
              <IconDeviceDesktop />
            </ViewportToggle>
            <ViewportToggle
              value="tablet"
              label={labels.tablet}
              active={viewport === "tablet"}
              onSelect={selectViewport}
            >
              <IconDeviceTablet />
            </ViewportToggle>
            <ViewportToggle
              value="mobile"
              label={labels.mobile}
              active={viewport === "mobile"}
              onSelect={selectViewport}
            >
              <IconDeviceMobile />
            </ViewportToggle>
          </ToggleGroup>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={labels.openNewTab}
            render={
              <a href={previewUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            <IconExternalLink />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={labels.refresh}
            onClick={() => setIframeKey((key) => key + 1)}
          >
            <IconRefresh />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={labels.copyInstall}
            className="max-w-96 font-mono text-xs"
            onClick={async () => {
              if (await copyToClipboardWithMeta(command)) {
                setInstallCopied(true)
              }
            }}
          >
            {installCopied ? <IconCheck /> : <IconTerminal2 />}
            <span className="truncate">{command}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:hidden">
        <div className="flex items-center gap-2 px-2">
          <p className="line-clamp-1 text-sm font-medium">{item.description}</p>
          <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
            {item.name}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border bg-background">
          <Image
            src={getBlockScreenshotUrl(item.name, "light")}
            alt={`${item.name} light preview`}
            data-block={item.name}
            width={1440}
            height={900}
            unoptimized
            className="object-cover dark:hidden"
          />
          <Image
            src={getBlockScreenshotUrl(item.name, "dark")}
            alt={`${item.name} dark preview`}
            data-block={item.name}
            width={1440}
            height={900}
            unoptimized
            className="hidden object-cover dark:block"
          />
        </div>
      </div>

      <div
        className="relative hidden h-(--block-height) data-[view=preview]:lg:block"
        data-view={view}
      >
        <div className="absolute inset-0 right-4 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[20px_20px]" />
        <ResizablePanelGroup
          orientation="horizontal"
          className="relative z-10 after:absolute after:inset-0 after:right-3 after:-z-10 after:rounded-xl after:bg-muted/40"
        >
          <ResizablePanel
            panelRef={previewPanelRef}
            defaultSize="100%"
            minSize="30%"
            className="relative overflow-hidden rounded-xl border bg-background"
          >
            <iframe
              key={iframeKey}
              src={previewUrl}
              title={`${item.name} preview`}
              height={item.meta?.iframeHeight ?? "930px"}
              loading="lazy"
              className="relative z-20 h-full w-full bg-background"
            />
          </ResizablePanel>
          <ResizableHandle className="relative w-3 bg-transparent after:absolute after:top-1/2 after:right-0 after:h-8 after:w-1.5 after:-translate-y-1/2 after:rounded-full after:bg-border" />
          <ResizablePanel defaultSize="0%" minSize="0%" />
        </ResizablePanelGroup>
      </div>

      <div
        data-view={view}
        className="hidden h-(--block-height) overflow-hidden rounded-xl border bg-muted/30 data-[view=code]:lg:flex"
      >
        <div className="w-72 shrink-0">
          <BlockViewerFileTree
            tree={tree}
            activeFile={activeSource?.path ?? null}
            filesLabel={labels.files}
            onSelect={setActiveFile}
          />
        </div>
        {activeSource && (
          <figure className="relative flex min-w-0 flex-1 flex-col bg-code text-code-foreground">
            <figcaption className="flex h-12 shrink-0 items-center gap-2 border-b px-4 font-mono text-xs">
              <IconFileCode />
              <span className="truncate">{activeSource.path}</span>
              <CopyButton
                value={activeSource.source}
                className="static ml-auto bg-transparent"
              />
            </figcaption>
            <div
              key={activeSource.path}
              className="min-h-0 flex-1 overflow-auto"
              dangerouslySetInnerHTML={{
                __html: activeSource.highlightedContent,
              }}
            />
          </figure>
        )}
      </div>
    </Tabs>
  )
}

function ViewportToggle({
  value,
  label,
  active,
  onSelect,
  children,
}: {
  value: BlockViewport
  label: string
  active: boolean
  onSelect: (viewport: BlockViewport) => void
  children: React.ReactNode
}) {
  return (
    <ToggleGroupItem
      aria-label={label}
      title={label}
      pressed={active}
      onPressedChange={(pressed) => pressed && onSelect(value)}
    >
      {children}
    </ToggleGroupItem>
  )
}

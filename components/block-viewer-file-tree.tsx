"use client"

import * as React from "react"
import { IconChevronRight, IconFile, IconFolder } from "@tabler/icons-react"

import type { BlockFileTreeNode } from "@/lib/block-source"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function BlockViewerFileTree({
  tree,
  activeFile,
  filesLabel,
  onSelect,
}: {
  tree: readonly BlockFileTreeNode[]
  activeFile: string | null
  filesLabel: string
  onSelect: (path: string) => void
}) {
  return (
    <SidebarProvider className="min-h-0! border-r bg-muted/20">
      <Sidebar collapsible="none" className="w-full bg-transparent">
        <SidebarGroupLabel className="h-12 shrink-0 rounded-none border-b px-4 text-sm">
          {filesLabel}
        </SidebarGroupLabel>
        <SidebarContent>
          <ScrollArea className="h-full">
            <SidebarGroup className="p-0 py-2">
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {tree.map((item) => (
                    <TreeNode
                      key={`${item.path ?? "folder"}:${item.name}`}
                      item={item}
                      depth={0}
                      activeFile={activeFile}
                      onSelect={onSelect}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  )
}

function TreeNode({
  item,
  depth,
  activeFile,
  onSelect,
}: {
  item: BlockFileTreeNode
  depth: number
  activeFile: string | null
  onSelect: (path: string) => void
}) {
  const indentation = `${0.5 + depth * 0.85}rem`

  if (!item.children) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          type="button"
          isActive={item.path === activeFile}
          onClick={() => item.path && onSelect(item.path)}
          className="rounded-none text-xs whitespace-nowrap data-[active=true]:bg-muted"
          style={{ paddingInlineStart: indentation }}
        >
          <IconChevronRight className="invisible" />
          <IconFile />
          <span>{item.name}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <Collapsible defaultOpen className="group/tree-folder">
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              type="button"
              className="rounded-none text-xs whitespace-nowrap"
              style={{ paddingInlineStart: indentation }}
            />
          }
        >
          <IconChevronRight className="transition-transform group-data-open/tree-folder:rotate-90" />
          <IconFolder />
          <span>{item.name}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub className="m-0 w-full translate-x-0 border-none p-0">
            {item.children.map((child) => (
              <TreeNode
                key={`${child.path ?? "folder"}:${child.name}`}
                item={child}
                depth={depth + 1}
                activeFile={activeFile}
                onSelect={onSelect}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}

import type * as React from "react"
import type * as PageTree from "fumadocs-core/page-tree"

export type SidebarGroup = {
  label: React.ReactNode
  pages: PageTree.Item[]
}

function collectPages(node: PageTree.Node, acc: Array<PageTree.Item>) {
  if (node.type === "page") {
    acc.push(node as PageTree.Item)
  } else if (node.type === "folder") {
    if (node.$ref?.folder === "installation") {
      if (node.index) {
        acc.push({
          ...node.index,
          name: node.index.url.startsWith("/ko/") ? "설치" : "Installation",
        })
      }
      return
    }

    for (const child of node.children) {
      collectPages(child, acc)
    }
  }
}

/**
 * Split the tree's root children on separator nodes. Each separator starts a
 * new group labeled with the separator's name (already localized by the
 * per-locale meta.json). Folders flatten into their pages.
 */
export function getSidebarGroups(tree: PageTree.Root): SidebarGroup[] {
  const groups: SidebarGroup[] = []
  let current: SidebarGroup = { label: null, pages: [] }

  for (const node of tree.children) {
    if (node.type === "separator") {
      if (current.pages.length > 0) {
        groups.push(current)
      }
      current = { label: node.name, pages: [] }
    } else {
      collectPages(node, current.pages)
    }
  }

  if (current.pages.length > 0) {
    groups.push(current)
  }

  return groups
}

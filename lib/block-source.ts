import { highlightCode } from "@/lib/highlight-code"
import { readFileFromRoot } from "@/lib/read-file"
import {
  getBlockSourceLanguage,
  type BlockFile,
  type BlockItem,
} from "@/lib/blocks"

export type BlockFileTreeNode = {
  name: string
  path?: string
  children?: BlockFileTreeNode[]
}

export type BlockDisplayFile = {
  path: string
  sourcePath: string
  source: string
  language: string
  highlightedContent: string
}

export function createBlockFileTree(
  files: readonly Pick<BlockFile, "path" | "target">[]
) {
  const tree: BlockFileTreeNode[] = []

  for (const file of files) {
    const installPath = file.target ?? file.path
    const segments = installPath.split("/").filter(Boolean)
    let nodes = tree

    segments.forEach((segment, index) => {
      const isFile = index === segments.length - 1

      if (isFile) {
        if (!nodes.some((node) => node.path === installPath)) {
          nodes.push({ name: segment, path: installPath })
        }
        return
      }

      let folder = nodes.find(
        (node) => node.name === segment && node.children !== undefined
      )

      if (!folder) {
        folder = { name: segment, children: [] }
        nodes.push(folder)
      }

      nodes = folder.children ?? []
    })
  }

  return sortFileTree(tree)
}

export async function loadBlockDisplayData(item: BlockItem) {
  const files = await Promise.all(
    item.files.map(async (file): Promise<BlockDisplayFile> => {
      let source: string

      try {
        source = await readFileFromRoot(file.path)
      } catch (cause) {
        throw new Error(`Block source file not found: ${file.path}`, { cause })
      }

      const path = file.target ?? file.path
      const language = getBlockSourceLanguage(path)

      return {
        path,
        sourcePath: file.path,
        source,
        language,
        highlightedContent: await highlightCode(source, language),
      }
    })
  )

  return {
    tree: createBlockFileTree(item.files),
    files,
  }
}

function sortFileTree(nodes: BlockFileTreeNode[]): BlockFileTreeNode[] {
  return nodes
    .map((node) => ({
      ...node,
      children: node.children ? sortFileTree(node.children) : undefined,
    }))
    .sort((left, right) => {
      const leftIsFolder = left.children !== undefined
      const rightIsFolder = right.children !== undefined

      if (leftIsFolder !== rightIsFolder) return leftIsFolder ? -1 : 1
      return left.name.localeCompare(right.name)
    })
}

import { describe, expect, test } from "bun:test"
import type * as PageTree from "fumadocs-core/page-tree"

import { getSidebarGroups } from "@/lib/page-tree"

describe("getSidebarGroups", () => {
  test("keeps the installation index while hiding its framework pages", () => {
    const installationIndex: PageTree.Item = {
      type: "page",
      name: "Index",
      url: "/docs/installation",
    }

    const tree = {
      type: "root",
      name: "Docs",
      children: [
        {
          type: "folder",
          $id: "en:installation",
          $ref: { folder: "installation" },
          name: "Frameworks",
          index: installationIndex,
          children: [
            {
              type: "page",
              name: "Next",
              url: "/docs/installation/next",
            },
          ],
        },
      ],
    } satisfies PageTree.Root

    const pages = getSidebarGroups(tree).flatMap((group) => group.pages)

    expect(pages).toEqual([
      {
        ...installationIndex,
        name: "Installation",
      },
    ])
  })
})

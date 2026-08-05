import { describe, expect, test } from "bun:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { BlockViewer } from "@/components/block-viewer"
import {
  BLOCK_VIEWPORTS,
  getBlockInstallCommand,
  getBlockPreviewUrl,
  getBlockScreenshotUrl,
} from "@/lib/blocks"

const labels = {
  preview: "Preview",
  code: "Code",
  desktop: "Desktop",
  tablet: "Tablet",
  mobile: "Mobile",
  openNewTab: "Open in new tab",
  refresh: "Refresh preview",
  files: "Files",
  copyInstall: "Copy install command",
}

describe("Block Viewer", () => {
  test("uses the official responsive viewport and asset contracts", () => {
    expect(BLOCK_VIEWPORTS).toEqual({
      desktop: "100%",
      tablet: "60%",
      mobile: "30%",
    })
    expect(getBlockInstallCommand("agent-workspace-01")).toBe(
      "npx shadcn@latest add @ondo-ui/agent-workspace-01"
    )
    expect(getBlockPreviewUrl("agent-workspace-01")).toBe(
      "/view/agent-workspace-01/"
    )
    expect(getBlockScreenshotUrl("agent-workspace-01", "light")).toBe(
      "/r/styles/base-vega/agent-workspace-01-light.png"
    )
    expect(getBlockScreenshotUrl("agent-workspace-01", "dark")).toBe(
      "/r/styles/base-vega/agent-workspace-01-dark.png"
    )
  })

  test("renders an isolated iframe, compact screenshots, and install command", () => {
    const html = renderToStaticMarkup(
      createElement(BlockViewer, {
        item: {
          name: "agent-workspace-01",
          type: "registry:block",
          description: "Agent workspace",
          files: [],
          meta: { iframeHeight: "900px" },
        },
        labels,
        tree: [
          {
            name: "app",
            children: [
              {
                name: "page.tsx",
                path: "app/agent-workspace/page.tsx",
              },
            ],
          },
        ],
        files: [
          {
            path: "app/agent-workspace/page.tsx",
            sourcePath: "components/blocks/agent-workspace-01/page.tsx",
            source: "export default function Page() {}",
            language: "tsx",
            highlightedContent: "<pre><code>Page</code></pre>",
          },
        ],
      })
    )

    expect(html).toContain('src="/view/agent-workspace-01/"')
    expect(html).toContain(
      'src="/r/styles/base-vega/agent-workspace-01-light.png"'
    )
    expect(html).toContain(
      'src="/r/styles/base-vega/agent-workspace-01-dark.png"'
    )
    expect(html).toContain("npx shadcn@latest add @ondo-ui/agent-workspace-01")
    expect(html).toContain('data-slot="tabs"')
  })
})

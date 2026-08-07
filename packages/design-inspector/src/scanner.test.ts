import { describe, expect, test } from "bun:test"

import { scanInspectorPages } from "./scanner"

function anchor(
  href: string,
  options: {
    ariaLabel?: string
    download?: boolean
    text?: string
    title?: string
  } = {}
): HTMLAnchorElement {
  const attributes: Record<string, string | undefined> = {
    href,
    "aria-label": options.ariaLabel,
    title: options.title,
  }

  return {
    getAttribute(name: string) {
      return attributes[name] ?? null
    },
    hasAttribute(name: string) {
      return name === "download" && options.download === true
    },
    textContent: options.text ?? "",
  } as unknown as HTMLAnchorElement
}

function pageDocument(links: HTMLAnchorElement[]): Document {
  return {
    location: {
      href: "https://app.example.com/orders/?__ondo_inspector_frame=1#open",
      origin: "https://app.example.com",
    },
    querySelectorAll() {
      return links
    },
    title: "Orders",
  } as unknown as Document
}

describe("scanInspectorPages", () => {
  test("collects unique same-origin pages with accessible labels", () => {
    const pages = scanInspectorPages(
      pageDocument([
        anchor("/orders#recent", { text: "Recent orders" }),
        anchor("/customers/", { text: "  Customer\n directory  " }),
        anchor("/settings", { ariaLabel: "Account settings" }),
        anchor("/help", { title: "Help center" }),
        anchor("#filters", { text: "Filters" }),
        anchor("https://external.example.com", { text: "External" }),
        anchor("/report.csv", { download: true, text: "Download" }),
      ])
    )

    expect(pages).toEqual([
      { href: "/orders", label: "Orders" },
      { href: "/customers", label: "Customer directory" },
      { href: "/settings", label: "Account settings" },
      { href: "/help", label: "Help center" },
    ])
  })
})

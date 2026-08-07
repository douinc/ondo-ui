import { describe, expect, test } from "bun:test"

import {
  areInspectorInstancesEqual,
  buildInspectorDocsHref,
  buildInspectorFrameUrl,
  createInspectorShortcutDetector,
  extractPresentationProps,
  getAdjacentInspectorViewportMode,
  groupInspectorInstances,
  mergeInspectorPages,
  normalizeInspectorPageHref,
  parseInspectorSettings,
  preserveInspectorFrameMarker,
  resolveInspectorPreferenceShortcut,
  resolveInspectorLocale,
  resolveInspectorScreenshotShortcut,
  resolveInspectorViewportShortcut,
  summarizeViewportStatus,
  usesMacShortcutGlyph,
  VIEWPORT_PRESETS,
  type InspectorInstance,
} from "./model"

function instance(
  name: string,
  visible: boolean,
  id = `${name}-${visible ? "visible" : "hidden"}`
): InspectorInstance {
  return {
    id,
    kind: "component",
    name,
    props: {},
    visible,
  }
}

describe("buildInspectorFrameUrl", () => {
  test("keeps same-origin paths and replaces inspector control flags", () => {
    expect(
      buildInspectorFrameUrl(
        "/orders?status=open&__ondo_inspector=1#summary",
        "https://app.example.com"
      )
    ).toBe(
      "https://app.example.com/orders?status=open&__ondo_inspector_frame=1#summary"
    )
  })

  test.each([
    "https://other.example.com/orders",
    "//other.example.com/orders",
    "javascript:alert(1)",
    "data:text/html,hello",
    "https://user:password@app.example.com/orders",
  ])("rejects unsafe targets: %s", (target) => {
    expect(() =>
      buildInspectorFrameUrl(target, "https://app.example.com")
    ).toThrow()
  })
})

describe("viewport presets", () => {
  test("uses distinct FHD and QHD desktop canvases", () => {
    expect(VIEWPORT_PRESETS).toEqual({
      mobile: { width: 390, height: 844 },
      tablet: { width: 768, height: 1024 },
      fhd: { width: 1920, height: 1080 },
      qhd: { width: 2560, height: 1440 },
    })
  })
})

describe("inspector page navigation", () => {
  test("normalizes same-origin pages without fragments or inspector flags", () => {
    expect(
      normalizeInspectorPageHref(
        "/orders/?status=open&__ondo_inspector_frame=1#summary",
        "https://app.example.com"
      )
    ).toBe("/orders?status=open")
  })

  test("merges duplicate pages and upgrades fallback labels", () => {
    expect(
      mergeInspectorPages(
        [
          { href: "/", label: "Home" },
          { href: "/orders", label: "/orders" },
        ],
        [
          { href: "/orders", label: "Orders" },
          { href: "/settings", label: "Settings" },
        ]
      )
    ).toEqual([
      { href: "/", label: "Home" },
      { href: "/orders", label: "Orders" },
      { href: "/settings", label: "Settings" },
    ])
  })
})

describe("inspector locale", () => {
  test("uses the inspected document language before the route locale", () => {
    expect(
      resolveInspectorLocale("ko-KR", "/docs/components/button", "en")
    ).toBe("ko")
    expect(
      resolveInspectorLocale("en-US", "/ko/docs/components/button", "ko")
    ).toBe("en")
  })

  test("uses an explicit locale route before the configured fallback", () => {
    expect(resolveInspectorLocale(undefined, "/ko/docs", "en")).toBe("ko")
    expect(resolveInspectorLocale(undefined, "/en/docs", "ko")).toBe("en")
    expect(resolveInspectorLocale(undefined, "/docs", "ko")).toBe("ko")
  })

  test("builds locale-specific Separator documentation links", () => {
    expect(buildInspectorDocsHref("en", "component", "separator")).toBe(
      "https://ui.ondo.dou.so/docs/components/separator"
    )
    expect(buildInspectorDocsHref("ko", "component", "separator")).toBe(
      "https://ui.ondo.dou.so/ko/docs/components/separator"
    )
  })
})

describe("inspector keyboard shortcuts", () => {
  test("maps a quick double Shift press to the inspector toggle", () => {
    const detect = createInspectorShortcutDetector()

    expect(detect("Shift", 1_000)).toBeUndefined()
    expect(detect("Shift", 1_300)).toBe("toggle-inspector")
  })

  test("maps a quick double Option/Alt press to the layer toggle", () => {
    const detect = createInspectorShortcutDetector()

    expect(detect("Alt", 1_000)).toBeUndefined()
    expect(detect("Alt", 1_250)).toBe("toggle-layers")
  })

  test("resets after slow, interrupted, and completed sequences", () => {
    const detect = createInspectorShortcutDetector()

    expect(detect("Shift", 1_000)).toBeUndefined()
    expect(detect("Shift", 1_500)).toBeUndefined()
    expect(detect("A", 1_550)).toBeUndefined()
    expect(detect("Shift", 1_600)).toBeUndefined()
    expect(detect("Shift", 1_700)).toBe("toggle-inspector")
    expect(detect("Shift", 1_750)).toBeUndefined()
  })
})

describe("inspector preference shortcuts", () => {
  const optionOnly = {
    altKey: true,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  }

  test.each([
    ["KeyT", "cycle-theme"],
    ["KeyO", "cycle-desktop-os"],
    ["KeyL", "cycle-locale"],
  ] as const)("maps Option/Alt + %s to %s", (code, shortcut) => {
    expect(resolveInspectorPreferenceShortcut(code, optionOnly)).toBe(shortcut)
  })

  test("ignores other keys and additional modifiers", () => {
    expect(
      resolveInspectorPreferenceShortcut("KeyP", optionOnly)
    ).toBeUndefined()
    expect(
      resolveInspectorPreferenceShortcut("KeyT", {
        ...optionOnly,
        metaKey: true,
      })
    ).toBeUndefined()
    expect(
      resolveInspectorPreferenceShortcut("KeyT", {
        ...optionOnly,
        altKey: false,
      })
    ).toBeUndefined()
  })

  test("uses platform-specific Mac and Windows shortcut labels", () => {
    expect(usesMacShortcutGlyph("MacIntel")).toBe(true)
    expect(usesMacShortcutGlyph("iPhone")).toBe(true)
    expect(usesMacShortcutGlyph("Win32")).toBe(false)
    expect(usesMacShortcutGlyph("Linux x86_64")).toBe(false)
  })
})

describe("inspector screenshot shortcut", () => {
  const optionOnly = {
    altKey: true,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  }

  test("maps Option/Alt + S to the screenshot menu", () => {
    expect(resolveInspectorScreenshotShortcut("KeyS", optionOnly)).toBe(
      "open-screenshot"
    )
  })

  test("ignores other keys and additional modifiers", () => {
    expect(
      resolveInspectorScreenshotShortcut("KeyP", optionOnly)
    ).toBeUndefined()
    expect(
      resolveInspectorScreenshotShortcut("KeyS", {
        ...optionOnly,
        shiftKey: true,
      })
    ).toBeUndefined()
  })
})

describe("inspector viewport shortcuts", () => {
  const optionOnly = {
    altKey: true,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
  }

  test("maps Option/Alt + arrows to previous and next", () => {
    expect(resolveInspectorViewportShortcut("ArrowLeft", optionOnly)).toBe(
      "previous"
    )
    expect(resolveInspectorViewportShortcut("ArrowRight", optionOnly)).toBe(
      "next"
    )
  })

  test("ignores unrelated keys and additional modifiers", () => {
    expect(
      resolveInspectorViewportShortcut("ArrowUp", optionOnly)
    ).toBeUndefined()
    expect(
      resolveInspectorViewportShortcut("ArrowRight", {
        ...optionOnly,
        metaKey: true,
      })
    ).toBeUndefined()
  })

  test("cycles through every viewport and compare in both directions", () => {
    expect(getAdjacentInspectorViewportMode("mobile", "next")).toBe("tablet")
    expect(getAdjacentInspectorViewportMode("tablet", "next")).toBe("fhd")
    expect(getAdjacentInspectorViewportMode("fhd", "next")).toBe("qhd")
    expect(getAdjacentInspectorViewportMode("qhd", "next")).toBe("compare")
    expect(getAdjacentInspectorViewportMode("compare", "next")).toBe("mobile")
    expect(getAdjacentInspectorViewportMode("mobile", "previous")).toBe(
      "compare"
    )
  })
})

describe("inspector settings", () => {
  const fallback = {
    desktopOs: "macos",
    locale: "en",
    theme: "system",
  } as const

  test("prefers valid persisted settings", () => {
    expect(
      parseInspectorSettings(
        JSON.stringify({
          desktopOs: "ubuntu",
          locale: "ko",
          theme: "dark",
        }),
        fallback
      )
    ).toEqual({ desktopOs: "ubuntu", locale: "ko", theme: "dark" })
  })

  test("falls back field by field for missing or invalid settings", () => {
    expect(
      parseInspectorSettings(
        JSON.stringify({ desktopOs: "ios", locale: "ko", theme: 1 }),
        fallback
      )
    ).toEqual({ desktopOs: "macos", locale: "ko", theme: "system" })
  })

  test("uses the fallback when storage is empty or malformed", () => {
    expect(parseInspectorSettings(null, fallback)).toEqual(fallback)
    expect(parseInspectorSettings("not-json", fallback)).toEqual(fallback)
  })
})

describe("extractPresentationProps", () => {
  test("accepts Base UI presentation attributes", () => {
    expect(
      extractPresentationProps({
        "data-slot": "button",
        "data-variant": "outline",
        "data-size": "sm",
        "data-orientation": "vertical",
        "data-open": "",
        "data-value": "private-value",
      })
    ).toEqual({
      orientation: "vertical",
      size: "sm",
      variant: "outline",
    })
  })

  test("does not expose component identity or slot metadata as props", () => {
    expect(
      extractPresentationProps({
        "data-slot": "select-trigger",
        "data-size": "default",
      })
    ).toEqual({ size: "default" })
  })
})

describe("groupInspectorInstances", () => {
  test("groups components and compositions independently in name order", () => {
    const groups = groupInspectorInstances([
      instance("button", true, "button-2"),
      {
        ...instance("empty-view", true, "empty-view-1"),
        kind: "composition",
      },
      instance("badge", true, "badge-1"),
      instance("button", false, "button-1"),
    ])

    expect(groups.map(({ key, instances }) => [key, instances.length])).toEqual(
      [
        ["component:badge", 1],
        ["component:button", 2],
        ["composition:empty-view", 1],
      ]
    )
  })
})

describe("summarizeViewportStatus", () => {
  test("distinguishes visible, hidden, and absent instances", () => {
    expect(
      summarizeViewportStatus({
        mobile: [instance("button", false)],
        tablet: [instance("button", true)],
        fhd: [],
        qhd: [instance("button", true)],
      })
    ).toEqual({
      mobile: "hidden",
      tablet: "visible",
      fhd: "absent",
      qhd: "visible",
    })
  })
})

describe("areInspectorInstancesEqual", () => {
  test("treats structurally identical inventories as equal", () => {
    const left = [
      { ...instance("button", true), props: { size: "sm", variant: "ghost" } },
      instance("badge", false),
    ]
    const right = [
      { ...instance("button", true), props: { size: "sm", variant: "ghost" } },
      instance("badge", false),
    ]

    expect(areInspectorInstancesEqual(left, right)).toBe(true)
    expect(areInspectorInstancesEqual([], [])).toBe(true)
  })

  test("detects changed identity, visibility, order, and props", () => {
    const base = instance("button", true)

    expect(areInspectorInstancesEqual([base], [])).toBe(false)
    expect(
      areInspectorInstancesEqual([base], [{ ...base, id: "other" }])
    ).toBe(false)
    expect(
      areInspectorInstancesEqual([base], [{ ...base, visible: false }])
    ).toBe(false)
    expect(
      areInspectorInstancesEqual(
        [base, instance("badge", true)],
        [instance("badge", true), base]
      )
    ).toBe(false)
    expect(
      areInspectorInstancesEqual(
        [{ ...base, props: { variant: "ghost" } }],
        [{ ...base, props: { variant: "outline" } }]
      )
    ).toBe(false)
    expect(
      areInspectorInstancesEqual(
        [{ ...base, props: { variant: "ghost" } }],
        [{ ...base, props: { variant: "ghost", size: "sm" } }]
      )
    ).toBe(false)
  })
})

describe("preserveInspectorFrameMarker", () => {
  const base = "https://app.example.com/docs/components/button/"

  test("adds the marker to a relative url missing it", () => {
    expect(preserveInspectorFrameMarker("/docs/components/badge", base)).toBe(
      "https://app.example.com/docs/components/badge?__ondo_inspector_frame=1"
    )
  })

  test("adds the marker to an absolute url missing it", () => {
    expect(
      preserveInspectorFrameMarker(
        "https://app.example.com/orders?status=open",
        base
      )
    ).toBe(
      "https://app.example.com/orders?status=open&__ondo_inspector_frame=1"
    )
  })

  test("passes a url that already carries the marker through unchanged", () => {
    const url = "/docs?__ondo_inspector_frame=1"
    expect(preserveInspectorFrameMarker(url, base)).toBe(url)
  })

  test("passes null and undefined through unchanged", () => {
    expect(preserveInspectorFrameMarker(undefined, base)).toBeUndefined()
    expect(preserveInspectorFrameMarker(null, base)).toBeNull()
  })

  test("passes an unresolvable url through unchanged instead of throwing", () => {
    const url = "https://user:pass@[invalid"
    expect(preserveInspectorFrameMarker(url, base)).toBe(url)
  })
})

"use client"

import * as React from "react"
import { IconCopy } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { describeColor, type ColorFormats } from "@/lib/colors"
import { TOKEN_GROUPS } from "@/lib/theme-tokens"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const FIELDS: ReadonlyArray<{ key: keyof ColorFormats; label: string }> = [
  { key: "tailwindClassName", label: "tailwind" },
  { key: "oklch", label: "oklch" },
  { key: "hex", label: "hex" },
  { key: "rgb", label: "rgb" },
  { key: "hsl", label: "hsl" },
]

type ColorSnapshot = Record<string, ColorFormats | null>

// Resolved CSS variables depend on the `.dark` class, which next-themes toggles
// outside of React. useSyncExternalStore re-reads them whenever that class changes,
// without touching state from inside an effect.
let cachedSnapshot: ColorSnapshot | null = null
const EMPTY_SNAPSHOT: ColorSnapshot = {}

function readSnapshot(): ColorSnapshot {
  const styles = getComputedStyle(document.documentElement)
  const next: ColorSnapshot = {}
  for (const group of TOKEN_GROUPS) {
    for (const token of group.tokens) {
      next[token] = describeColor(styles.getPropertyValue(`--${token}`).trim())
    }
  }
  return next
}

function getSnapshot() {
  cachedSnapshot ??= readSnapshot()
  return cachedSnapshot
}

function getServerSnapshot(): ColorSnapshot {
  return EMPTY_SNAPSHOT
}

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(() => {
    cachedSnapshot = null
    onStoreChange()
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  })
  // Next.js CSS HMR swaps <link>/<style> content in <head> during development,
  // so re-read here too — otherwise editing globals.css needs a manual refresh.
  observer.observe(document.head, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["href"],
  })
  return () => observer.disconnect()
}

type FieldKey = (typeof FIELDS)[number]["key"]

const FIELD_KEYS = FIELDS.map((field) => field.key)
const VISIBLE_FIELDS_STORAGE_KEY = "ondo-ui:colors:visible-fields"
const DEFAULT_VISIBLE_FIELDS: FieldKey[] = ["tailwindClassName", "oklch"]

function isFieldKey(value: unknown): value is FieldKey {
  return typeof value === "string" && (FIELD_KEYS as string[]).includes(value)
}

let cachedVisibleFields: FieldKey[] | null = null
const visibleFieldsListeners = new Set<() => void>()

function readVisibleFields(): FieldKey[] {
  try {
    const raw = window.localStorage.getItem(VISIBLE_FIELDS_STORAGE_KEY)
    if (!raw) return DEFAULT_VISIBLE_FIELDS
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter(isFieldKey)
      : DEFAULT_VISIBLE_FIELDS
  } catch {
    return DEFAULT_VISIBLE_FIELDS
  }
}

function getVisibleFieldsSnapshot() {
  cachedVisibleFields ??= readVisibleFields()
  return cachedVisibleFields
}

function getVisibleFieldsServerSnapshot() {
  return DEFAULT_VISIBLE_FIELDS
}

function setVisibleFields(next: FieldKey[]) {
  cachedVisibleFields = next
  try {
    window.localStorage.setItem(
      VISIBLE_FIELDS_STORAGE_KEY,
      JSON.stringify(next)
    )
  } catch {
    // Ignore write failures (private browsing, storage quota, etc).
  }
  visibleFieldsListeners.forEach((listener) => listener())
}

function subscribeVisibleFields(onStoreChange: () => void) {
  visibleFieldsListeners.add(onStoreChange)
  function onStorage(event: StorageEvent) {
    if (event.key === VISIBLE_FIELDS_STORAGE_KEY) {
      cachedVisibleFields = null
      onStoreChange()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    visibleFieldsListeners.delete(onStoreChange)
    window.removeEventListener("storage", onStorage)
  }
}

export function ColorPalette({
  copiedLabel,
  customLabel,
  fieldsLabel,
}: {
  copiedLabel: string
  customLabel: string
  fieldsLabel: string
}) {
  const colors = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const visibleFields = React.useSyncExternalStore(
    subscribeVisibleFields,
    getVisibleFieldsSnapshot,
    getVisibleFieldsServerSnapshot
  )
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  async function copyValue(fieldKey: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopiedKey(fieldKey)
    setTimeout(
      () => setCopiedKey((current) => (current === fieldKey ? null : current)),
      1500
    )
  }

  const activeFields = FIELDS.filter((field) =>
    visibleFields.includes(field.key)
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          {fieldsLabel}
        </span>
        <ToggleGroup
          multiple
          variant="outline"
          size="sm"
          value={visibleFields}
          onValueChange={(next) => setVisibleFields(next.filter(isFieldKey))}
        >
          {FIELDS.map((field) => (
            <ToggleGroupItem
              key={field.key}
              value={field.key}
              className="font-mono text-xs uppercase"
            >
              {field.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-10">
        {TOKEN_GROUPS.map((group) => (
          <section key={group.label} className="flex flex-col gap-3">
            <h2 className="font-heading text-sm font-semibold tracking-wide uppercase">
              {group.label}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {group.tokens.map((token) => {
                const formats = colors[token]

                return (
                  <div
                    key={token}
                    className="flex flex-col overflow-hidden rounded-lg border"
                  >
                    <span
                      aria-hidden
                      className="h-16 w-full border-b"
                      style={{ backgroundColor: `var(--${token})` }}
                    />
                    <div className="flex flex-col gap-2 p-3">
                      <span className="font-mono text-xs font-medium">
                        --{token}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {activeFields.map((field) => {
                          const fieldKey = `${token}:${field.key}`
                          const isCopied = copiedKey === fieldKey

                          if (!formats) {
                            return (
                              <div
                                key={field.key}
                                className="flex items-center gap-2 rounded-md px-1.5 py-1"
                              >
                                <span className="w-16 shrink-0 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                                  {field.label}
                                </span>
                                <span className="flex-1 font-mono text-xs text-muted-foreground/60">
                                  …
                                </span>
                              </div>
                            )
                          }

                          const value = formats[field.key]

                          if (value === null) {
                            return (
                              <div
                                key={field.key}
                                className="flex items-center gap-2 rounded-md px-1.5 py-1"
                              >
                                <span className="w-16 shrink-0 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                                  {field.label}
                                </span>
                                <span className="flex-1 truncate font-mono text-xs text-muted-foreground/70 italic">
                                  {customLabel}
                                </span>
                              </div>
                            )
                          }

                          return (
                            <button
                              key={field.key}
                              type="button"
                              onClick={() => copyValue(fieldKey, value)}
                              className={cn(
                                "group/row flex items-center gap-2 rounded-md px-1.5 py-1 text-left",
                                "outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                                isCopied && "bg-muted"
                              )}
                            >
                              <span
                                className={cn(
                                  "w-16 shrink-0 font-mono text-[10px] tracking-wide uppercase",
                                  isCopied
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                )}
                              >
                                {isCopied ? copiedLabel : field.label}
                              </span>
                              <span className="flex-1 truncate font-mono text-xs">
                                {value}
                              </span>
                              <IconCopy className="size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

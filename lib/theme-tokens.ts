export const TOKEN_GROUPS = [
  {
    label: "Base",
    tokens: ["background", "foreground", "border", "input", "ring"],
  },
  {
    label: "Brand",
    tokens: [
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "accent",
      "accent-foreground",
    ],
  },
  {
    label: "Surface",
    tokens: [
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "muted",
      "muted-foreground",
    ],
  },
  {
    label: "Feedback",
    tokens: ["info", "success", "warning", "destructive"],
  },
  {
    label: "Chart",
    tokens: ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  },
  {
    label: "Sidebar",
    tokens: [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
  },
] as const

export type TokenGroup = (typeof TOKEN_GROUPS)[number]

"use client"

import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

type DesktopWindowOs = "macos" | "windows" | "ubuntu"

const DesktopWindowContext = React.createContext<{ os: DesktopWindowOs }>({
  os: "macos",
})

function useDesktopWindowOs() {
  return React.useContext(DesktopWindowContext).os
}

const desktopWindowVariants = cva(
  "flex flex-col overflow-hidden border border-black/10 shadow-2xl dark:border-white/10",
  {
    variants: {
      os: {
        macos: "rounded-[0.625rem]",
        windows: "rounded-lg",
        ubuntu: "rounded-xl",
      },
    },
    defaultVariants: {
      os: "macos",
    },
  }
)

const desktopWindowTitlebarVariants = cva(
  "group/titlebar relative flex shrink-0 items-center select-none",
  {
    variants: {
      os: {
        macos:
          "h-7 border-b border-black/10 bg-[oklch(0.943_0_0)] px-5 dark:border-white/10 dark:bg-[oklch(0.294_0.004_286.2)]",
        windows:
          "h-8 bg-[oklch(0.964_0_0)] ps-3 pe-0 dark:bg-[oklch(0.244_0_0)]",
        ubuntu:
          "h-12 border-b border-black/10 bg-[oklch(0.94_0_0)] px-3 dark:border-white/10 dark:bg-[oklch(0.309_0_0)]",
      },
    },
    defaultVariants: {
      os: "macos",
    },
  }
)

// macOS and Ubuntu center the title on the window, so it is taken out of flow.
// The inset -- not padding -- reserves room for the controls, because `truncate`
// clips at the title's own padding box: padding would leave the text free to
// render straight over the buttons, while an inset moves the clip edge itself.
//
// The inset is the titlebar's horizontal padding PLUS the controls' width. An
// absolutely positioned box resolves against its ancestor's padding box, and a
// padding box *includes* that padding rather than excluding it, so the titlebar's
// own `px-*` has to be added here or the title starts on top of the controls.
//
//   macOS   px-5 (20px) + three 12px lights + two 8px gaps  = 72px = inset-x-18
//   Ubuntu  px-3 (12px) + three 24px buttons + two 6px gaps = 96px = inset-x-24
const desktopWindowTitleVariants = cva("truncate", {
  variants: {
    os: {
      macos:
        "pointer-events-none absolute inset-x-18 text-center text-[0.8125rem]/[1] font-semibold text-black/70 dark:text-white/80",
      windows:
        "min-w-0 pe-2 text-[0.75rem]/[1] font-normal text-black/80 dark:text-white/90",
      ubuntu:
        "pointer-events-none absolute inset-x-24 text-center text-[0.875rem]/[1] font-bold text-black/80 dark:text-white/90",
    },
  },
  defaultVariants: {
    os: "macos",
  },
})

const desktopWindowControlsVariants = cva("flex shrink-0 items-center", {
  variants: {
    os: {
      macos: "z-10 gap-2",
      windows: "order-last ms-auto",
      ubuntu: "z-10 order-last ms-auto gap-1.5",
    },
  },
  defaultVariants: {
    os: "macos",
  },
})

interface DesktopWindowProps extends React.ComponentProps<"div"> {
  os?: DesktopWindowOs
}

function DesktopWindow({ os = "macos", className, ...props }: DesktopWindowProps) {
  const context = React.useMemo(() => ({ os }), [os])

  return (
    <DesktopWindowContext.Provider value={context}>
      <div
        data-slot="desktop-window"
        data-os={os}
        className={cn(desktopWindowVariants({ os }), className)}
        {...props}
      />
    </DesktopWindowContext.Provider>
  )
}

type DesktopWindowTitlebarProps = React.ComponentProps<"div">

function DesktopWindowTitlebar({ className, ...props }: DesktopWindowTitlebarProps) {
  const os = useDesktopWindowOs()

  return (
    <div
      data-slot="desktop-window-titlebar"
      data-os={os}
      className={cn(desktopWindowTitlebarVariants({ os }), className)}
      {...props}
    />
  )
}

type DesktopWindowTitleProps = React.ComponentProps<"div">

function DesktopWindowTitle({ className, ...props }: DesktopWindowTitleProps) {
  const os = useDesktopWindowOs()

  return (
    <div
      data-slot="desktop-window-title"
      data-os={os}
      className={cn(desktopWindowTitleVariants({ os }), className)}
      {...props}
    />
  )
}

type DesktopWindowContentProps = React.ComponentProps<"div">

function DesktopWindowContent({ className, ...props }: DesktopWindowContentProps) {
  const os = useDesktopWindowOs()

  return (
    <div
      data-slot="desktop-window-content"
      data-os={os}
      className={cn("min-w-0 flex-1 bg-background", className)}
      {...props}
    />
  )
}

const MACOS_LIGHTS = {
  close: { label: "Close", color: "bg-[oklch(0.694_0.196_26.4)]" },
  minimize: { label: "Minimize", color: "bg-[oklch(0.835_0.161_80.9)]" },
  zoom: { label: "Zoom", color: "bg-[oklch(0.728_0.217_144.7)]" },
} as const

// Windows 11 and Ubuntu draw the same three shapes; only the button around
// them differs, so the glyph is shared rather than copied per platform.
type CaptionAction = "minimize" | "maximize" | "close"

const WINDOWS_CAPTIONS = {
  minimize: {
    label: "Minimize",
    interactive:
      "hover:bg-black/[0.06] focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 dark:hover:bg-white/[0.08]",
  },
  maximize: {
    label: "Maximize",
    interactive:
      "hover:bg-black/[0.06] focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 dark:hover:bg-white/[0.08]",
  },
  close: {
    label: "Close",
    interactive:
      "hover:bg-[oklch(0.536_0.191_30.1)] hover:text-white focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70",
  },
} as const

function DesktopWindowControl({
  label,
  onClick,
  className,
  interactive,
  children,
}: {
  label: string
  onClick?: () => void
  className: string
  interactive: string
  children: React.ReactNode
}) {
  // Decorative by default: a mockup should not put three no-op stops in the
  // tab order, and a hover wash on something unclickable is a lie.
  if (!onClick) {
    return (
      <span aria-hidden="true" className={className}>
        {children}
      </span>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        className,
        interactive,
        "outline-none [&:focus-visible_svg]:opacity-100"
      )}
    >
      {children}
    </button>
  )
}

function MacosGlyph({ action }: { action: keyof typeof MACOS_LIGHTS }) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      className="size-2 text-black/55 opacity-0 transition-opacity group-hover/titlebar:opacity-100"
    >
      {action === "close" ? <path d="M2.6 2.6 7.4 7.4M7.4 2.6 2.6 7.4" /> : null}
      {action === "minimize" ? <path d="M2.4 5h5.2" /> : null}
      {action === "zoom" ? (
        <path
          d="M2.4 2.4h3.1L2.4 5.5zM7.6 7.6H4.5l3.1-3.1z"
          fill="currentColor"
          stroke="none"
        />
      ) : null}
    </svg>
  )
}

function MacosLight({
  action,
  onClick,
}: {
  action: keyof typeof MACOS_LIGHTS
  onClick?: () => void
}) {
  const { label, color } = MACOS_LIGHTS[action]

  return (
    <DesktopWindowControl
      label={label}
      onClick={onClick}
      className={cn(
        "grid size-3 place-items-center rounded-full inset-ring-[0.5px] inset-ring-black/15",
        color
      )}
      interactive="focus-visible:ring-2 focus-visible:ring-ring/70"
    >
      <MacosGlyph action={action} />
    </DesktopWindowControl>
  )
}

function CaptionGlyph({ action }: { action: CaptionAction }) {
  return (
    <svg
      viewBox="0 0 10 10"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      className="size-[0.625rem]"
    >
      {action === "minimize" ? <path d="M1 5h8" /> : null}
      {action === "maximize" ? (
        <rect x="1.5" y="1.5" width="7" height="7" rx="1" />
      ) : null}
      {action === "close" ? <path d="M1.6 1.6 8.4 8.4M8.4 1.6 1.6 8.4" /> : null}
    </svg>
  )
}

function WindowsCaption({
  action,
  onClick,
}: {
  action: CaptionAction
  onClick?: () => void
}) {
  const { label, interactive } = WINDOWS_CAPTIONS[action]

  return (
    <DesktopWindowControl
      label={label}
      onClick={onClick}
      className="grid h-8 w-[2.875rem] place-items-center text-black/80 transition-colors dark:text-white/90"
      interactive={interactive}
    >
      <CaptionGlyph action={action} />
    </DesktopWindowControl>
  )
}

const UBUNTU_CAPTIONS = {
  minimize: { label: "Minimize" },
  maximize: { label: "Maximize" },
  close: { label: "Close" },
} as const

function UbuntuCaption({
  action,
  onClick,
}: {
  action: CaptionAction
  onClick?: () => void
}) {
  const { label } = UBUNTU_CAPTIONS[action]

  return (
    <DesktopWindowControl
      label={label}
      onClick={onClick}
      // Yaru gives every button the same gray circle -- unlike Windows 11,
      // close is not red.
      className="grid size-6 place-items-center rounded-full bg-black/10 text-black/80 transition-colors dark:bg-white/10 dark:text-white/90"
      interactive="hover:bg-black/15 focus-visible:ring-2 focus-visible:ring-ring/70 dark:hover:bg-white/15"
    >
      <CaptionGlyph action={action} />
    </DesktopWindowControl>
  )
}

interface DesktopWindowControlsProps extends React.ComponentProps<"div"> {
  onClose?: () => void
  onMinimize?: () => void
  onMaximize?: () => void
}

function DesktopWindowControls({
  onClose,
  onMinimize,
  onMaximize,
  className,
  ...props
}: DesktopWindowControlsProps) {
  const os = useDesktopWindowOs()

  return (
    <div
      data-slot="desktop-window-controls"
      data-os={os}
      className={cn(desktopWindowControlsVariants({ os }), className)}
      {...props}
    >
      {os === "macos" ? (
        <>
          <MacosLight action="close" onClick={onClose} />
          <MacosLight action="minimize" onClick={onMinimize} />
          <MacosLight action="zoom" onClick={onMaximize} />
        </>
      ) : os === "windows" ? (
        <>
          <WindowsCaption action="minimize" onClick={onMinimize} />
          <WindowsCaption action="maximize" onClick={onMaximize} />
          <WindowsCaption action="close" onClick={onClose} />
        </>
      ) : (
        <>
          <UbuntuCaption action="minimize" onClick={onMinimize} />
          <UbuntuCaption action="maximize" onClick={onMaximize} />
          <UbuntuCaption action="close" onClick={onClose} />
        </>
      )}
    </div>
  )
}

export {
  DesktopWindow,
  DesktopWindowContent,
  DesktopWindowControls,
  DesktopWindowTitle,
  DesktopWindowTitlebar,
  type DesktopWindowContentProps,
  type DesktopWindowControlsProps,
  type DesktopWindowOs,
  type DesktopWindowProps,
  type DesktopWindowTitleProps,
  type DesktopWindowTitlebarProps,
}

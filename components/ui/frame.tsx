import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const frameVariants = cva(
  [
    "relative flex flex-col gap-(--frame-gap) rounded-(--frame-radius) bg-muted/50 px-(--frame-px) py-(--frame-py)",
    "[--frame-radius:var(--radius-xl)] [--frame-radius-inset:--spacing(0.75)]",
    "[--frame-panel-footer-gap:--spacing(1)] [--frame-panel-header-gap:0rem]",
    "[--frame-panel-footer-px-adjust:0px] [--frame-panel-footer-py-adjust:0px] [--frame-panel-header-px-adjust:0px] [--frame-panel-header-py-adjust:0px] [--frame-panel-px-adjust:0px] [--frame-panel-py-adjust:0px]",
    "[--frame-panel-footer-px:calc(var(--frame-panel-footer-px-base)_+_var(--frame-panel-footer-px-adjust))] [--frame-panel-footer-py:calc(var(--frame-panel-footer-py-base)_+_var(--frame-panel-footer-py-adjust))] [--frame-panel-header-px:calc(var(--frame-panel-header-px-base)_+_var(--frame-panel-header-px-adjust))] [--frame-panel-header-py:calc(var(--frame-panel-header-py-base)_+_var(--frame-panel-header-py-adjust))] [--frame-panel-px:calc(var(--frame-panel-px-base)_+_var(--frame-panel-px-adjust))] [--frame-panel-py:calc(var(--frame-panel-py-base)_+_var(--frame-panel-py-adjust))]",
    "[--frame-border-color:var(--color-border)] [--frame-panel-bg:var(--color-card)] [--frame-panel-border-color:var(--color-border)]",
    "[--frame-panel-radius:calc(var(--frame-radius)_-_var(--frame-radius-inset)_-_1px)]",
  ],
  {
    variants: {
      variant: {
        default: "border border-[var(--frame-border-color)] bg-clip-padding",
        inverse:
          "border border-[var(--frame-border-color)] bg-background bg-clip-padding [--frame-panel-bg:color-mix(in_oklch,var(--color-muted)_40%,transparent)]",
        ghost:
          "[--frame-panel-radius:calc(var(--frame-radius)_-_var(--frame-radius-inset))]",
      },
      spacing: {
        xs: "[--frame-gap:--spacing(0.5)] [--frame-px:--spacing(0.5)] [--frame-py:--spacing(0.5)] [--frame-panel-footer-px-base:--spacing(2)] [--frame-panel-footer-py-base:--spacing(1.5)] [--frame-panel-header-px-base:--spacing(2)] [--frame-panel-header-py-base:--spacing(1.5)] [--frame-panel-px-base:--spacing(2)] [--frame-panel-py-base:--spacing(1.5)]",
        sm: "[--frame-gap:--spacing(1)] [--frame-px:--spacing(1)] [--frame-py:--spacing(1)] [--frame-panel-footer-px-base:--spacing(3)] [--frame-panel-footer-py-base:--spacing(2.5)] [--frame-panel-header-px-base:--spacing(3)] [--frame-panel-header-py-base:--spacing(2.5)] [--frame-panel-px-base:--spacing(3)] [--frame-panel-py-base:--spacing(2.5)]",
        default:
          "[--frame-gap:--spacing(1.5)] [--frame-px:--spacing(1.5)] [--frame-py:--spacing(1.5)] [--frame-panel-footer-px-base:--spacing(4)] [--frame-panel-footer-py-base:--spacing(3.5)] [--frame-panel-header-px-base:--spacing(4)] [--frame-panel-header-py-base:--spacing(3.5)] [--frame-panel-px-base:--spacing(4)] [--frame-panel-py-base:--spacing(3.5)]",
        lg: "[--frame-gap:--spacing(2)] [--frame-px:--spacing(2)] [--frame-py:--spacing(2)] [--frame-panel-footer-px-base:--spacing(5)] [--frame-panel-footer-py-base:--spacing(4.5)] [--frame-panel-header-px-base:--spacing(5)] [--frame-panel-header-py-base:--spacing(4.5)] [--frame-panel-px-base:--spacing(5)] [--frame-panel-py-base:--spacing(4.5)]",
      },
      stacked: {
        true: [
          "gap-0 *:has-[+[data-slot=frame-panel]]:rounded-b-none",
          "*:has-[+[data-slot=frame-panel]]:before:hidden",
          "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:rounded-t-none",
          "*:[[data-slot=frame-panel]+[data-slot=frame-panel]]:border-t-0",
        ],
        false: "",
      },
      dense: {
        true: "gap-0 border-[var(--frame-border-color)] p-0 [--frame-panel-radius:var(--frame-radius)] [&_[data-slot=frame-panel]]:-mx-px [&_[data-slot=frame-panel]]:before:hidden [&_[data-slot=frame-panel]:last-child]:-mb-px [&:not(:has([data-slot=frame-panel-header]))_[data-slot=frame-panel]:is(:first-child)]:-mt-px",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      spacing: "default",
      stacked: false,
      dense: false,
    },
  }
)

function Frame({
  className,
  variant,
  spacing,
  stacked,
  dense,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof frameVariants>) {
  return (
    <div
      className={cn(
        frameVariants({ variant, spacing, stacked, dense }),
        className
      )}
      data-slot="frame"
      data-spacing={spacing}
      {...props}
    />
  )
}

function FramePanel({
  className,
  fit,
  ...props
}: React.ComponentProps<"div"> & { fit?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-(--frame-panel-radius) border border-(--frame-panel-border-color) bg-(--frame-panel-bg) bg-clip-padding shadow-xs",
        !fit && "grow",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--frame-panel-radius)_-_1px)] before:shadow-black/5",
        "dark:bg-clip-border dark:before:shadow-white/5",
        "px-(--frame-panel-px) py-(--frame-panel-py)",
        className
      )}
      data-slot="frame-panel"
      {...props}
    />
  )
}

function FrameHeader({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      className={cn(
        "flex flex-col gap-(--frame-panel-header-gap) px-(--frame-panel-header-px) py-(--frame-panel-header-py)",
        className
      )}
      data-slot="frame-panel-header"
      {...props}
    />
  )
}

function FrameTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm font-semibold", className)}
      data-slot="frame-panel-title"
      {...props}
    />
  )
}

function FrameDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="frame-panel-description"
      {...props}
    />
  )
}

function FrameFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "flex flex-col gap-(--frame-panel-footer-gap) px-(--frame-panel-footer-px) py-(--frame-panel-footer-py)",
        className
      )}
      data-slot="frame-panel-footer"
      {...props}
    />
  )
}

export {
  Frame,
  FramePanel,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FrameFooter,
  frameVariants,
}

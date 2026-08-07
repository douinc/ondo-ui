"use client"

import { cva, type VariantProps } from "class-variance-authority"

import { Badge } from "@/components/ui/badge"
import { NumberCount } from "@/components/ui/number-count"
import { cn } from "@/lib/utils"

const numberBadgeVariants = cva(
  "absolute z-10 min-w-5 justify-center rounded-full px-1 tabular-nums ring-1 ring-background backdrop-blur-sm transition-all duration-200 ease-out select-none",
  {
    variants: {
      placement: {
        "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
        "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
        "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
        "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
      },
      hidden: {
        true: "scale-0 opacity-0 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      placement: "top-right",
      hidden: false,
    },
  }
)

interface NumberBadgeProps
  extends Omit<React.ComponentProps<typeof Badge>, "children"> {
  value: number
  max?: number
  showZero?: boolean
  placement?: NonNullable<VariantProps<typeof numberBadgeVariants>["placement"]>
  children?: React.ReactNode
}

function NumberBadge({
  value,
  max = 99,
  showZero = false,
  placement = "top-right",
  variant = "default",
  className,
  children,
  ...props
}: NumberBadgeProps) {
  const capped = value > max
  const hidden = value <= 0 && !showZero

  return (
    <span
      className="relative inline-flex w-fit shrink-0"
      data-slot="number-badge"
      data-variant={variant}
      data-placement={placement}
      data-hidden={String(hidden)}
    >
      {children}
      <Badge
        variant={variant}
        aria-hidden={hidden || undefined}
        className={cn(numberBadgeVariants({ placement, hidden }), className)}
        {...props}
      >
        <NumberCount
          value={capped ? max : value}
          suffix={capped ? "+" : undefined}
        />
      </Badge>
    </span>
  )
}

export { NumberBadge, numberBadgeVariants, type NumberBadgeProps }

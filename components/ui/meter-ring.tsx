"use client"

import * as React from "react"
import { Meter as MeterPrimitive } from "@base-ui/react/meter"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const meterRingVariants = cva(
  "group/meter-ring flex w-fit flex-col items-center gap-1.5 text-center transition-[--meter-ring-fraction] duration-500 ease-out",
  {
    variants: {
      size: {
        sm: "text-xs [--meter-ring-size:--spacing(14)] [--meter-ring-thickness:--spacing(1.5)]",
        default:
          "text-sm [--meter-ring-size:--spacing(20)] [--meter-ring-thickness:--spacing(2)]",
        lg: "text-base [--meter-ring-size:--spacing(28)] [--meter-ring-thickness:--spacing(2.5)]",
      },
      variant: {
        default: "text-primary",
        info: "text-info",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

function MeterRingProperty() {
  return (
    <style href="ondo-ui-meter-ring-fraction" precedence="default">
      {
        "@property --meter-ring-fraction{syntax:'<number>';inherits:true;initial-value:0}"
      }
    </style>
  )
}

function MeterRing({
  className,
  size = "default",
  variant = "default",
  value,
  min = 0,
  max = 100,
  formatValue,
  children,
  ...props
}: MeterPrimitive.Root.Props &
  VariantProps<typeof meterRingVariants> & {
    formatValue?: (formattedValue: string, value: number) => React.ReactNode
  }) {
  const span = max - min || 1
  const fraction = Math.min(1, Math.max(0, (value - min) / span))

  return (
    <MeterPrimitive.Root
      value={value}
      min={min}
      max={max}
      data-slot="meter-ring"
      data-size={size}
      data-variant={variant}
      className={cn(meterRingVariants({ size, variant, className }))}
      style={{ "--meter-ring-fraction": fraction } as React.CSSProperties}
      {...props}
    >
      <MeterRingProperty />
      <MeterRingDial>
        <MeterRingValue>{formatValue}</MeterRingValue>
      </MeterRingDial>
      {children}
    </MeterPrimitive.Root>
  )
}

function MeterRingDial({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="meter-ring-dial"
      className={cn(
        "grid size-(--meter-ring-size) shrink-0 place-items-center *:col-start-1 *:row-start-1",
        className
      )}
      {...props}
    >
      <MeterRingTrack />
      {children}
    </div>
  )
}

function MeterRingTrack({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="meter-ring-track"
      aria-hidden="true"
      className={cn(
        "size-full rounded-full bg-muted",
        "[mask:radial-gradient(farthest-side,#0000_calc(100%-var(--meter-ring-thickness)),#000_calc(100%-var(--meter-ring-thickness)+1px))]",
        className
      )}
      {...props}
    >
      <MeterRingIndicator />
    </span>
  )
}

function MeterRingIndicator({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="meter-ring-indicator"
      className={cn(
        "block size-full rounded-full",
        "[background:conic-gradient(currentColor_calc(var(--meter-ring-fraction)*360deg),#0000_0)]",
        className
      )}
      {...props}
    />
  )
}

function MeterRingValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-ring-value"
      className={cn("font-medium text-foreground tabular-nums", className)}
      {...props}
    />
  )
}

function MeterRingLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-ring-label"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  MeterRing,
  MeterRingDial,
  MeterRingTrack,
  MeterRingIndicator,
  MeterRingValue,
  MeterRingLabel,
  meterRingVariants,
}

"use client"

import { Meter as MeterPrimitive } from "@base-ui/react/meter"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const meterVariants = cva("group/meter flex flex-wrap gap-3", {
  variants: {
    variant: {
      default: "text-primary",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      destructive: "text-destructive",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Meter({
  className,
  variant = "default",
  children,
  value,
  ...props
}: MeterPrimitive.Root.Props & VariantProps<typeof meterVariants>) {
  return (
    <MeterPrimitive.Root
      value={value}
      data-slot="meter"
      data-variant={variant}
      className={cn(meterVariants({ variant, className }))}
      {...props}
    >
      {children}
      <MeterTrack>
        <MeterIndicator />
      </MeterTrack>
    </MeterPrimitive.Root>
  )
}

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn(
        "relative flex h-1.5 w-full items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
}

function MeterIndicator({
  className,
  ...props
}: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn("h-full bg-current transition-all", className)}
      {...props}
    />
  )
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    />
  )
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

export {
  Meter,
  MeterTrack,
  MeterIndicator,
  MeterLabel,
  MeterValue,
  meterVariants,
}

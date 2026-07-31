"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const timelineVariants = cva(
  "group/timeline flex [--timeline-rail:1rem] data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
  {
    variants: {
      size: {
        sm: "[--timeline-icon:0.5rem] [--timeline-indicator:0.75rem]",
        default: "[--timeline-icon:0.625rem] [--timeline-indicator:1rem]",
        lg: "[--timeline-icon:0.875rem] [--timeline-indicator:1.5rem]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type TimelineContextValue = {
  activeStep: number
  setActiveStep: (step: number) => void
}

const TimelineContext = createContext<TimelineContextValue | undefined>(
  undefined
)

const useTimeline = () => {
  const context = useContext(TimelineContext)
  if (!context) {
    throw new Error("useTimeline must be used within a Timeline")
  }
  return context
}

interface TimelineProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof timelineVariants> {
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => void
  orientation?: "horizontal" | "vertical"
}

function Timeline({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "vertical",
  size = "default",
  className,
  render,
  children,
  ...props
}: TimelineProps) {
  const [activeStep, setInternalStep] = useState(defaultValue)

  const setActiveStep = useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step)
      }
      onValueChange?.(step)
    },
    [value, onValueChange]
  )

  const currentStep = value ?? activeStep

  const defaultProps = {
    className: cn(timelineVariants({ size }), className),
    "data-orientation": orientation,
    "data-size": size,
    "data-slot": "timeline",
    children,
  }

  return (
    <TimelineContext.Provider
      value={{ activeStep: currentStep, setActiveStep }}
    >
      {useRender({
        defaultTagName: "div",
        render,
        props: mergeProps<"div">(defaultProps, props),
      })}
    </TimelineContext.Provider>
  )
}

function TimelineContent({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn("text-sm text-muted-foreground", className),
    "data-slot": "timeline-content",
    children,
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

type TimelineDateProps = useRender.ComponentProps<"time">

function TimelineDate({
  className,
  render,
  children,
  ...props
}: TimelineDateProps) {
  const defaultProps = {
    className: cn(
      "mb-1 block text-xs font-medium text-muted-foreground group-data-[orientation=vertical]/timeline:max-sm:h-4",
      className
    ),
    "data-slot": "timeline-date",
    children,
  }

  return useRender({
    defaultTagName: "time",
    render,
    props: mergeProps<"time">(defaultProps, props),
  })
}

function TimelineHeader({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    className: cn(className),
    "data-slot": "timeline-header",
    children,
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

const timelineIndicatorVariants = cva(
  [
    "absolute flex size-(--timeline-indicator) items-center justify-center rounded-full",
    "group-data-[orientation=horizontal]/timeline:top-[calc((var(--timeline-indicator)/2+var(--timeline-rail))*-1)] group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
    "group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:left-[calc((var(--timeline-indicator)/2+var(--timeline-rail))*-1)] group-data-[orientation=vertical]/timeline:-translate-x-1/2",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-(--timeline-icon)",
    "before:absolute before:inset-0 before:-z-1 before:hidden before:rounded-full before:bg-(--timeline-accent) before:opacity-75",
    "group-data-completed/timeline-item:before:bg-(--timeline-accent-done)",
  ],
  {
    variants: {
      variant: {
        default:
          "[--timeline-accent-done:var(--color-primary)] [--timeline-accent-fg:var(--color-primary-foreground)] [--timeline-accent:var(--color-primary)]",
        muted:
          "[--timeline-accent-done:var(--color-primary)] [--timeline-accent-fg:var(--color-primary-foreground)] [--timeline-accent:var(--color-muted-foreground)]",
        info: "[--timeline-accent-done:var(--color-info)] [--timeline-accent-fg:var(--color-background)] [--timeline-accent:var(--color-info)]",
        success:
          "[--timeline-accent-done:var(--color-success)] [--timeline-accent-fg:var(--color-background)] [--timeline-accent:var(--color-success)]",
        warning:
          "[--timeline-accent-done:var(--color-warning)] [--timeline-accent-fg:var(--color-background)] [--timeline-accent:var(--color-warning)]",
        destructive:
          "[--timeline-accent-done:var(--color-destructive)] [--timeline-accent-fg:var(--color-background)] [--timeline-accent:var(--color-destructive)]",
      },
      fill: {
        outline:
          "border-2 border-(--timeline-accent)/20 text-(--timeline-accent) group-data-completed/timeline-item:border-(--timeline-accent-done)",
        solid:
          "bg-(--timeline-accent)/10 text-(--timeline-accent) group-data-completed/timeline-item:bg-(--timeline-accent-done) group-data-completed/timeline-item:text-(--timeline-accent-fg)",
      },
      animate: {
        ping: "group-data-current/timeline-item:before:motion-safe:block group-data-current/timeline-item:before:motion-safe:animate-ping",
        pulse: "group-data-current/timeline-item:motion-safe:animate-pulse",
      },
    },
    defaultVariants: {
      variant: "default",
      fill: "outline",
    },
  }
)

interface TimelineIndicatorProps
  extends
    useRender.ComponentProps<"div">,
    VariantProps<typeof timelineIndicatorVariants> {}

function TimelineIndicator({
  className,
  variant = "default",
  fill = "outline",
  animate,
  children,
  render,
  ...props
}: TimelineIndicatorProps) {
  const defaultProps = {
    "aria-hidden": true,
    className: cn(
      timelineIndicatorVariants({ variant, fill, animate }),
      className
    ),
    "data-slot": "timeline-indicator",
    "data-variant": variant,
    "data-fill": fill,
    children,
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

interface TimelineItemProps extends useRender.ComponentProps<"div"> {
  step: number
}

function TimelineItem({
  step,
  className,
  render,
  children,
  ...props
}: TimelineItemProps) {
  const { activeStep } = useTimeline()

  const defaultProps = {
    className: cn(
      "group/timeline-item relative flex flex-1 flex-col gap-0.5 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:not-last:pb-6 has-[+[data-completed]]:**:data-[slot=timeline-separator]:bg-primary",
      "group-data-[orientation=horizontal]/timeline:mt-[calc(var(--timeline-indicator)+var(--timeline-rail))] group-data-[orientation=vertical]/timeline:ms-[calc(var(--timeline-indicator)+var(--timeline-rail))]",
      className
    ),
    "data-completed": step <= activeStep || undefined,
    "data-current": step === activeStep || undefined,
    "data-slot": "timeline-item",
    children,
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

function TimelineSeparator({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"div">) {
  const defaultProps = {
    "aria-hidden": true,
    className: cn(
      "absolute self-start bg-primary/10 group-last/timeline-item:hidden",
      "group-data-[orientation=horizontal]/timeline:top-[calc((var(--timeline-indicator)/2+var(--timeline-rail))*-1)] group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-var(--timeline-indicator)-0.25rem)] group-data-[orientation=horizontal]/timeline:translate-x-[calc(var(--timeline-indicator)+0.125rem)] group-data-[orientation=horizontal]/timeline:-translate-y-1/2",
      "group-data-[orientation=vertical]/timeline:left-[calc((var(--timeline-indicator)/2+var(--timeline-rail))*-1)] group-data-[orientation=vertical]/timeline:h-[calc(100%-var(--timeline-indicator)-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-[calc(var(--timeline-indicator)+0.125rem)]",
      className
    ),
    "data-slot": "timeline-separator",
    children,
  }

  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps<"div">(defaultProps, props),
  })
}

function TimelineTitle({
  className,
  render,
  children,
  ...props
}: useRender.ComponentProps<"h3">) {
  const defaultProps = {
    className: cn("text-sm font-medium", className),
    "data-slot": "timeline-title",
    children,
  }

  return useRender({
    defaultTagName: "h3",
    render,
    props: mergeProps<"h3">(defaultProps, props),
  })
}

export {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
  timelineVariants,
  timelineIndicatorVariants,
}

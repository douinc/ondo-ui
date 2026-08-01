"use client"

import type { HTMLAttributes } from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

type StepperOrientation = "horizontal" | "vertical"
type StepState = "active" | "completed" | "inactive"

type StepIndicators = {
  active?: React.ReactNode
  completed?: React.ReactNode
  inactive?: React.ReactNode
  loading?: React.ReactNode
}

interface StepperContextValue {
  activeStep: number
  setActiveStep: (step: number) => void
  orientation: StepperOrientation
  indicators: StepIndicators
  baseId: string
  registerTrigger: (node: HTMLButtonElement) => () => void
  focusNext: (node: HTMLButtonElement) => void
  focusPrev: (node: HTMLButtonElement) => void
  focusFirst: () => void
  focusLast: () => void
}

interface StepItemContextValue {
  step: number
  state: StepState
  isDisabled: boolean
  isLoading: boolean
}

const StepperContext = createContext<StepperContextValue | undefined>(undefined)
const StepItemContext = createContext<StepItemContextValue | undefined>(
  undefined
)

function useStepper() {
  const context = useContext(StepperContext)

  if (!context) {
    throw new Error("useStepper must be used within a Stepper")
  }

  return context
}

function useStepItem() {
  const context = useContext(StepItemContext)

  if (!context) {
    throw new Error("useStepItem must be used within a StepperItem")
  }

  return context
}

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: number
  value?: number
  onValueChange?: (value: number) => void
  orientation?: StepperOrientation
  indicators?: StepIndicators
}

function Stepper({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = "horizontal",
  indicators = {},
  className,
  children,
  ...props
}: StepperProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [triggerNodes, setTriggerNodes] = useState<HTMLButtonElement[]>([])
  const generatedId = useId().replace(/:/g, "")
  const baseId = `stepper-${generatedId}`
  const activeStep = value ?? internalValue

  const setActiveStep = useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalValue(step)
      }

      onValueChange?.(step)
    },
    [onValueChange, value]
  )

  const registerTrigger = useCallback((node: HTMLButtonElement) => {
    setTriggerNodes((nodes) =>
      nodes.includes(node) ? nodes : [...nodes, node]
    )

    return () => {
      setTriggerNodes((nodes) =>
        nodes.filter((candidate) => candidate !== node)
      )
    }
  }, [])

  const getEnabledTriggers = useCallback(
    () => triggerNodes.filter((node) => !node.disabled),
    [triggerNodes]
  )

  const focusNext = useCallback(
    (node: HTMLButtonElement) => {
      const enabledTriggers = getEnabledTriggers()
      const currentIndex = enabledTriggers.indexOf(node)

      if (enabledTriggers.length === 0) return

      enabledTriggers[
        currentIndex < 0 ? 0 : (currentIndex + 1) % enabledTriggers.length
      ]?.focus()
    },
    [getEnabledTriggers]
  )

  const focusPrev = useCallback(
    (node: HTMLButtonElement) => {
      const enabledTriggers = getEnabledTriggers()
      const currentIndex = enabledTriggers.indexOf(node)

      if (enabledTriggers.length === 0) return

      enabledTriggers[
        currentIndex < 0
          ? enabledTriggers.length - 1
          : (currentIndex - 1 + enabledTriggers.length) %
            enabledTriggers.length
      ]?.focus()
    },
    [getEnabledTriggers]
  )

  const focusFirst = useCallback(() => {
    getEnabledTriggers()[0]?.focus()
  }, [getEnabledTriggers])

  const focusLast = useCallback(() => {
    getEnabledTriggers().at(-1)?.focus()
  }, [getEnabledTriggers])

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      activeStep,
      setActiveStep,
      orientation,
      indicators,
      baseId,
      registerTrigger,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast,
    }),
    [
      activeStep,
      baseId,
      focusFirst,
      focusLast,
      focusNext,
      focusPrev,
      indicators,
      orientation,
      registerTrigger,
      setActiveStep,
    ]
  )

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        data-slot="stepper"
        data-orientation={orientation}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  )
}

interface StepperItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number
  completed?: boolean
  disabled?: boolean
  loading?: boolean
}

function StepperItem({
  step,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { activeStep } = useStepper()
  const state: StepState =
    completed || step < activeStep
      ? "completed"
      : step === activeStep
        ? "active"
        : "inactive"
  const isLoading = loading && step === activeStep

  return (
    <StepItemContext.Provider
      value={{ step, state, isDisabled: disabled, isLoading }}
    >
      <div
        data-slot="stepper-item"
        data-state={state}
        data-loading={isLoading || undefined}
        className={cn(
          "group/step flex items-center justify-center not-last:flex-1 group-data-[orientation=horizontal]/stepper-nav:flex-row group-data-[orientation=vertical]/stepper-nav:flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  )
}

type StepperTriggerProps = useRender.ComponentProps<"button">

function StepperTrigger({
  className,
  children,
  tabIndex,
  render,
  ...props
}: StepperTriggerProps) {
  const { state, isLoading, step, isDisabled } = useStepItem()
  const {
    activeStep,
    baseId,
    setActiveStep,
    registerTrigger,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
  } = useStepper()
  const isSelected = activeStep === step
  const tabId = `${baseId}-tab-${step}`
  const panelId = `${baseId}-panel-${step}`
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const node = buttonRef.current

    if (!node) return

    return registerTrigger(node)
  }, [registerTrigger])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const node = event.currentTarget

    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault()
        focusNext(node)
        break
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault()
        focusPrev(node)
        break
      case "Home":
        event.preventDefault()
        focusFirst()
        break
      case "End":
        event.preventDefault()
        focusLast()
        break
      case "Enter":
      case " ":
        event.preventDefault()
        setActiveStep(step)
        break
    }
  }

  const defaultProps = {
    type: "button" as const,
    role: "tab",
    id: tabId,
    "aria-selected": isSelected,
    "aria-controls": panelId,
    tabIndex:
      typeof tabIndex === "number"
        ? tabIndex
        : isDisabled
          ? -1
          : isSelected
            ? 0
            : -1,
    "data-slot": "stepper-trigger",
    "data-state": state,
    "data-loading": isLoading || undefined,
    className: cn(
      "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex cursor-pointer items-center gap-2.5 rounded-full outline-none focus-visible:z-10 focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-60",
      className
    ),
    onClick: () => setActiveStep(step),
    onKeyDown: handleKeyDown,
    disabled: isDisabled,
    children,
  }

  return useRender({
    defaultTagName: "button",
    render,
    ref: buttonRef,
    props: mergeProps<"button">(defaultProps, props),
  })
}

function StepperIndicator({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { state, isLoading } = useStepItem()
  const { indicators } = useStepper()
  let content = children

  if (isLoading && indicators.loading !== undefined) {
    content = indicators.loading
  } else if (indicators[state] !== undefined) {
    content = indicators[state]
  }

  return (
    <div
      data-slot="stepper-indicator"
      data-state={state}
      className={cn(
        "border-background bg-accent text-accent-foreground data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground relative flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs",
        className
      )}
      {...props}
    >
      <div className="absolute">{content}</div>
    </div>
  )
}

function StepperSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { state } = useStepItem()

  return (
    <div
      data-slot="stepper-separator"
      data-state={state}
      className={cn(
        "bg-muted style-vega:rounded-sm style-nova:rounded-sm style-maia:rounded-full style-lyra:rounded-none style-mira:rounded-sm style-luma:rounded-full style-rhea:rounded-full style-sera:rounded-none m-0.5 group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1 group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5",
        className
      )}
      {...props}
    />
  )
}

function StepperTitle({
  children,
  className,
  ...props
}: React.ComponentProps<"h3">) {
  const { state } = useStepItem()

  return (
    <h3
      data-slot="stepper-title"
      data-state={state}
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

function StepperDescription({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { state } = useStepItem()

  return (
    <div
      data-slot="stepper-description"
      data-state={state}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    >
      {children}
    </div>
  )
}

function StepperNav({
  children,
  className,
  ...props
}: React.ComponentProps<"nav">) {
  const { activeStep, orientation } = useStepper()

  return (
    <nav
      role="tablist"
      aria-orientation={orientation}
      data-slot="stepper-nav"
      data-state={activeStep}
      data-orientation={orientation}
      className={cn(
        "group/stepper-nav inline-flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
}

function StepperPanel({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { activeStep } = useStepper()

  return (
    <div
      data-slot="stepper-panel"
      data-state={activeStep}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface StepperContentProps extends React.ComponentProps<"div"> {
  value: number
  forceMount?: boolean
}

function StepperContent({
  value,
  forceMount = false,
  children,
  className,
  ...props
}: StepperContentProps) {
  const { activeStep, baseId } = useStepper()
  const isActive = value === activeStep

  if (!forceMount && !isActive) {
    return null
  }

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      data-slot="stepper-content"
      data-state={isActive ? "active" : "inactive"}
      className={cn("w-full", className, !isActive && forceMount && "hidden")}
      hidden={!isActive && forceMount}
      {...props}
    >
      {children}
    </div>
  )
}

export {
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  useStepItem,
  useStepper,
  type StepIndicators,
  type StepperContentProps,
  type StepperItemProps,
  type StepperProps,
  type StepperTriggerProps,
}

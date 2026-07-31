"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { IconSelector, IconCheck, IconChevronUp, IconChevronDown } from "@tabler/icons-react"

type SelectSize = "xs" | "sm" | "default" | "lg" | "xl" | "2xl"

const SelectSizeContext = React.createContext<SelectSize>("default")

function Select<Value, Multiple extends boolean | undefined = false>({
  size = "default",
  ...props
}: SelectPrimitive.Root.Props<Value, Multiple> & { size?: SelectSize }) {
  return (
    <SelectSizeContext.Provider value={size}>
      <SelectPrimitive.Root {...props} />
    </SelectSizeContext.Provider>
  )
}

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn(
        "scroll-my-1 p-1 group-data-[size=xs]/select-content:p-0.5 group-data-[size=xl]/select-content:p-1.5 group-data-[size=2xl]/select-content:p-2",
        className
      )}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size,
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: SelectSize
}) {
  const contextSize = React.useContext(SelectSizeContext)

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size ?? contextSize}
      className={cn(
        "group/select-trigger flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-9 data-[size=lg]:h-10 data-[size=sm]:h-8 data-[size=xs]:h-6 data-[size=xs]:gap-1 data-[size=xs]:py-1 data-[size=xs]:pr-1.5 data-[size=xs]:pl-2 data-[size=xs]:text-xs data-[size=xl]:h-11 data-[size=xl]:rounded-lg data-[size=xl]:pl-3 data-[size=xl]:text-base data-[size=2xl]:h-13 data-[size=2xl]:rounded-xl data-[size=2xl]:pl-4 data-[size=2xl]:text-lg *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={
          <IconSelector className="pointer-events-none size-4 text-muted-foreground group-data-[size=xs]/select-trigger:size-3 group-data-[size=xl]/select-trigger:size-5 group-data-[size=2xl]/select-trigger:size-6" />
        }
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"
  >) {
  const size = React.useContext(SelectSizeContext)

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          data-size={size}
          className={cn("group/select-content relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-md bg-popover text-popover-foreground data-[size=xs]:rounded-[min(var(--radius-md),8px)] data-[size=xl]:rounded-lg data-[size=2xl]:rounded-xl shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground group-data-[size=xs]/select-content:px-1.5 group-data-[size=xs]/select-content:py-1 group-data-[size=xl]/select-content:px-2.5 group-data-[size=xl]/select-content:text-sm group-data-[size=2xl]/select-content:px-3 group-data-[size=2xl]/select-content:text-base",
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 group-data-[size=xs]/select-content:gap-1.5 group-data-[size=xs]/select-content:py-1 group-data-[size=xs]/select-content:pr-7 group-data-[size=xs]/select-content:pl-1.5 group-data-[size=xs]/select-content:text-xs group-data-[size=xl]/select-content:rounded-md group-data-[size=2xl]/select-content:rounded-lg group-data-[size=xl]/select-content:gap-2.5 group-data-[size=xl]/select-content:py-2 group-data-[size=xl]/select-content:pr-9 group-data-[size=xl]/select-content:pl-2.5 group-data-[size=xl]/select-content:text-base group-data-[size=2xl]/select-content:gap-3 group-data-[size=2xl]/select-content:py-2.5 group-data-[size=2xl]/select-content:pr-10 group-data-[size=2xl]/select-content:pl-3 group-data-[size=2xl]/select-content:text-lg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/select-content:[&_svg:not([class*='size-'])]:size-3.5 group-data-[size=xl]/select-content:[&_svg:not([class*='size-'])]:size-5 group-data-[size=2xl]/select-content:[&_svg:not([class*='size-'])]:size-6 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center group-data-[size=xs]/select-content:right-1.5 group-data-[size=xs]/select-content:size-3.5 group-data-[size=xl]/select-content:right-2.5 group-data-[size=xl]/select-content:size-5 group-data-[size=2xl]/select-content:right-3 group-data-[size=2xl]/select-content:size-6" />
        }
      >
        <IconCheck className="pointer-events-none" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-border group-data-[size=xs]/select-content:-mx-0.5 group-data-[size=xl]/select-content:-mx-1.5 group-data-[size=2xl]/select-content:-mx-2",
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 group-data-[size=xs]/select-content:py-0.5 group-data-[size=xl]/select-content:py-1.5 group-data-[size=2xl]/select-content:py-2 [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/select-content:[&_svg:not([class*='size-'])]:size-3 group-data-[size=xl]/select-content:[&_svg:not([class*='size-'])]:size-5 group-data-[size=2xl]/select-content:[&_svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    >
      <IconChevronUp
      />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 group-data-[size=xs]/select-content:py-0.5 group-data-[size=xl]/select-content:py-1.5 group-data-[size=2xl]/select-content:py-2 [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/select-content:[&_svg:not([class*='size-'])]:size-3 group-data-[size=xl]/select-content:[&_svg:not([class*='size-'])]:size-5 group-data-[size=2xl]/select-content:[&_svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    >
      <IconChevronDown
      />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}

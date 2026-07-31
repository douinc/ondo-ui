"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { IconChevronDown, IconX, IconCheck } from "@tabler/icons-react"

type ComboboxSize = "xs" | "sm" | "default" | "lg" | "xl" | "2xl"

const ComboboxSizeContext = React.createContext<ComboboxSize>("default")

function Combobox<Value, Multiple extends boolean | undefined = false>({
  size = "default",
  ...props
}: ComboboxPrimitive.Root.Props<Value, Multiple> & { size?: ComboboxSize }) {
  return (
    <ComboboxSizeContext.Provider value={size}>
      <ComboboxPrimitive.Root {...props} />
    </ComboboxSizeContext.Provider>
  )
}

function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: ComboboxPrimitive.Trigger.Props) {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      {children}
      <IconChevronDown className="pointer-events-none size-4 text-muted-foreground" />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({ className, ...props }: ComboboxPrimitive.Clear.Props) {
  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      render={
        <InputGroupButton variant="ghost" size="icon-xs" />
      }
      className={cn(className)}
      {...props}
    >
      <IconX className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean
  showClear?: boolean
}) {
  const size = React.useContext(ComboboxSizeContext)

  return (
    <InputGroup size={size} className={cn("w-auto", className)}>
      <ComboboxPrimitive.Input
        render={<InputGroupInput disabled={disabled} />}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        {showTrigger && (
          <InputGroupButton
            size="icon-xs"
            variant="ghost"
            render={<ComboboxTrigger />}
            data-slot="input-group-button"
            className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
            disabled={disabled}
          />
        )}
        {showClear && <ComboboxClear disabled={disabled} />}
      </InputGroupAddon>
      {children}
    </InputGroup>
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  >) {
  const size = React.useContext(ComboboxSizeContext)

  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          data-chips={!!anchor}
          data-size={size}
          className={cn("group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground data-[size=xs]:rounded-[min(var(--radius-md),8px)] data-[size=xl]:rounded-lg data-[size=2xl]:rounded-xl shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-(--anchor-width) data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 data-[size=xs]:*:data-[slot=input-group]:m-0.5 data-[size=xs]:*:data-[slot=input-group]:mb-0 data-[size=xs]:*:data-[slot=input-group]:h-6 data-[size=sm]:*:data-[slot=input-group]:h-7 data-[size=lg]:*:data-[slot=input-group]:h-9 data-[size=xl]:*:data-[slot=input-group]:m-1.5 data-[size=xl]:*:data-[slot=input-group]:mb-0 data-[size=xl]:*:data-[slot=input-group]:h-10 data-[size=2xl]:*:data-[slot=input-group]:m-2 data-[size=2xl]:*:data-[slot=input-group]:mb-0 data-[size=2xl]:*:data-[slot=input-group]:h-11 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95", className )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({ className, ...props }: ComboboxPrimitive.List.Props) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 group-data-[size=xs]/combobox-content:p-0.5 group-data-[size=xl]/combobox-content:p-1.5 group-data-[size=2xl]/combobox-content:p-2 data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComboboxPrimitive.Item.Props) {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 group-data-[size=xs]/combobox-content:gap-1.5 group-data-[size=xs]/combobox-content:py-1 group-data-[size=xs]/combobox-content:pr-7 group-data-[size=xs]/combobox-content:pl-1.5 group-data-[size=xs]/combobox-content:text-xs group-data-[size=xl]/combobox-content:gap-2.5 group-data-[size=xl]/combobox-content:rounded-md group-data-[size=xl]/combobox-content:py-2 group-data-[size=xl]/combobox-content:pr-9 group-data-[size=xl]/combobox-content:pl-2.5 group-data-[size=xl]/combobox-content:text-base group-data-[size=2xl]/combobox-content:gap-3 group-data-[size=2xl]/combobox-content:rounded-lg group-data-[size=2xl]/combobox-content:py-2.5 group-data-[size=2xl]/combobox-content:pr-10 group-data-[size=2xl]/combobox-content:pl-3 group-data-[size=2xl]/combobox-content:text-lg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group-data-[size=xs]/combobox-content:[&_svg:not([class*='size-'])]:size-3.5 group-data-[size=xl]/combobox-content:[&_svg:not([class*='size-'])]:size-5 group-data-[size=2xl]/combobox-content:[&_svg:not([class*='size-'])]:size-6",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxPrimitive.ItemIndicator
        render={
          <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center group-data-[size=xs]/combobox-content:right-1.5 group-data-[size=xs]/combobox-content:size-3.5 group-data-[size=xl]/combobox-content:right-2.5 group-data-[size=xl]/combobox-content:size-5 group-data-[size=2xl]/combobox-content:right-3 group-data-[size=2xl]/combobox-content:size-6" />
        }
      >
        <IconCheck className="pointer-events-none" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

function ComboboxGroup({ className, ...props }: ComboboxPrimitive.Group.Props) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...props}
    />
  )
}

function ComboboxLabel({
  className,
  ...props
}: ComboboxPrimitive.GroupLabel.Props) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn(
        "px-2 py-1.5 text-xs text-muted-foreground group-data-[size=xs]/combobox-content:px-1.5 group-data-[size=xs]/combobox-content:py-1 group-data-[size=xl]/combobox-content:px-2.5 group-data-[size=xl]/combobox-content:text-sm group-data-[size=2xl]/combobox-content:px-3 group-data-[size=2xl]/combobox-content:text-base",
        className
      )}
      {...props}
    />
  )
}

function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return (
    <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
  )
}

function ComboboxEmpty({ className, ...props }: ComboboxPrimitive.Empty.Props) {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden w-full justify-center py-2 text-center text-sm text-muted-foreground group-data-[size=xs]/combobox-content:py-1.5 group-data-[size=xs]/combobox-content:text-xs group-data-[size=xl]/combobox-content:py-2.5 group-data-[size=xl]/combobox-content:text-base group-data-[size=2xl]/combobox-content:py-3 group-data-[size=2xl]/combobox-content:text-lg group-data-empty/combobox-content:flex",
        className
      )}
      {...props}
    />
  )
}

function ComboboxSeparator({
  className,
  ...props
}: ComboboxPrimitive.Separator.Props) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn(
        "-mx-1 my-1 h-px bg-border group-data-[size=xs]/combobox-content:-mx-0.5 group-data-[size=xl]/combobox-content:-mx-1.5 group-data-[size=2xl]/combobox-content:-mx-2",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  ...props
}: React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> &
  ComboboxPrimitive.Chips.Props) {
  const size = React.useContext(ComboboxSizeContext)

  return (
    <ComboboxPrimitive.Chips
      data-slot="combobox-chips"
      data-size={size}
      className={cn(
        "group/combobox-chips flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent bg-clip-padding px-2.5 py-1.5 text-sm shadow-xs transition-[color,box-shadow] data-[size=xl]:gap-2 data-[size=xl]:px-3 data-[size=xl]:py-2 data-[size=2xl]:gap-2 data-[size=2xl]:px-3.5 data-[size=2xl]:py-2.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-data-[slot=combobox-chip]:px-1.5 data-[size=xs]:min-h-6 data-[size=xs]:gap-1 data-[size=xs]:px-1.5 data-[size=xs]:py-1 data-[size=xs]:text-xs data-[size=xs]:has-data-[slot=combobox-chip]:px-1 data-[size=xl]:has-data-[slot=combobox-chip]:px-2 data-[size=2xl]:has-data-[slot=combobox-chip]:px-2.5 data-[size=lg]:min-h-10 data-[size=sm]:min-h-8 data-[size=xl]:min-h-11 data-[size=xl]:rounded-lg data-[size=xl]:text-base data-[size=2xl]:min-h-13 data-[size=2xl]:rounded-xl data-[size=2xl]:text-lg dark:bg-input/30 dark:has-aria-invalid:border-destructive/50 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: ComboboxPrimitive.Chip.Props & {
  showRemove?: boolean
}) {
  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      className={cn(
        "flex h-[calc(--spacing(5.5))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 group-data-[size=xs]/combobox-chips:h-4 group-data-[size=xs]/combobox-chips:px-1 group-data-[size=xs]/combobox-chips:text-[0.625rem] group-data-[size=xl]/combobox-chips:h-7 group-data-[size=xl]/combobox-chips:rounded-md group-data-[size=xl]/combobox-chips:px-2 group-data-[size=xl]/combobox-chips:text-sm group-data-[size=2xl]/combobox-chips:h-8 group-data-[size=2xl]/combobox-chips:rounded-lg group-data-[size=2xl]/combobox-chips:px-2.5 group-data-[size=2xl]/combobox-chips:text-base has-data-[slot=combobox-chip-remove]:pr-0",
        className
      )}
      {...props}
    >
      {children}
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          render={<Button variant="ghost" size="icon-xs" />}
          className="-ml-1 opacity-50 group-data-[size=xs]/combobox-chips:size-4 group-data-[size=xl]/combobox-chips:size-7 group-data-[size=2xl]/combobox-chips:size-8 hover:opacity-100 group-data-[size=xs]/combobox-chips:[&_svg]:size-2.5 group-data-[size=xl]/combobox-chips:[&_svg]:size-3.5 group-data-[size=2xl]/combobox-chips:[&_svg]:size-4"
          data-slot="combobox-chip-remove"
        >
          <IconX className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: ComboboxPrimitive.Input.Props) {
  return (
    <ComboboxPrimitive.Input
      data-slot="combobox-chip-input"
      className={cn("min-w-16 flex-1 outline-none", className)}
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}

"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type InputGroupSize = "xs" | "sm" | "default" | "lg" | "xl" | "2xl"

const InputGroupSizeContext = React.createContext<InputGroupSize>("default")

function InputGroup({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: InputGroupSize }) {
  return (
    <InputGroupSizeContext.Provider value={size}>
      <div
        data-slot="input-group"
        data-size={size}
        role="group"
        className={cn(
          "group/input-group relative flex h-9 w-full min-w-0 items-center rounded-md border border-input transition-[color,box-shadow] outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 data-[size=lg]:h-10 data-[size=sm]:h-8 data-[size=xs]:h-6 data-[size=xl]:h-11 data-[size=xl]:rounded-lg data-[size=2xl]:h-13 data-[size=2xl]:rounded-xl has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-3 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-3 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[>[data-align=block-end]]:h-auto! has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto! has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto! dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
          className
        )}
        {...props}
      />
    </InputGroupSizeContext.Provider>
  )
}

const inputGroupAddonVariants = cva(
  "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 group-data-[size=xs]/input-group:gap-1 group-data-[size=xs]/input-group:py-0.5 group-data-[size=xs]/input-group:text-xs group-data-[size=xl]/input-group:text-base group-data-[size=2xl]/input-group:gap-2.5 group-data-[size=2xl]/input-group:text-lg [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4 group-data-[size=xs]/input-group:[&>svg:not([class*='size-'])]:size-3 group-data-[size=xl]/input-group:[&>svg:not([class*='size-'])]:size-5 group-data-[size=2xl]/input-group:[&>svg:not([class*='size-'])]:size-6",
  {
    variants: {
      align: {
        "inline-start":
          "order-first pl-2 group-data-[size=xl]/input-group:pl-3 group-data-[size=2xl]/input-group:pl-4 has-[>button]:-ml-1 group-data-[size=xl]/input-group:has-[>button]:-ml-1.5 group-data-[size=2xl]/input-group:has-[>button]:-ml-2 has-[>kbd]:ml-[-0.15rem]",
        "inline-end":
          "order-last pr-2 group-data-[size=xl]/input-group:pr-3 group-data-[size=2xl]/input-group:pr-4 has-[>button]:-mr-1 group-data-[size=xl]/input-group:has-[>button]:-mr-1.5 group-data-[size=2xl]/input-group:has-[>button]:-mr-2 has-[>kbd]:mr-[-0.15rem]",
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2 group-data-[size=xs]/input-group:px-2 group-data-[size=xl]/input-group:px-3 group-data-[size=2xl]/input-group:px-4 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2 group-data-[size=xs]/input-group:px-2 group-data-[size=xl]/input-group:px-3 group-data-[size=2xl]/input-group:px-4 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus()
      }}
      {...props}
    />
  )
}

// Matches upstream shadcn exactly: the same four sizes, the same classes, and
// the size is NOT forwarded to Button. Diverging here would make a demo copied
// from the shadcn docs render differently -- upstream's `icon-xs` inherits
// Button's default 16px icon, and forwarding the size would shrink it to 12px.
const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

// Used when `size` is omitted. In a `default` group this renders exactly like
// upstream's `xs`; the group-scaled steps only exist for the sizes upstream's
// InputGroup does not have. The addon contributes vertical padding, so a fitted
// button is that much shorter than the group. Height only -- an icon-only button
// needs an explicit `icon-*` size, because CSS cannot tell an icon-only button
// from one with text: `:only-child` ignores text nodes, so `svg:only-child`
// matches `<button>label <svg/></button>` too.
const inputGroupButtonAutoSize =
  "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5 " +
  "group-data-[size=xs]/input-group:h-5 group-data-[size=xs]/input-group:gap-0.5 group-data-[size=xs]/input-group:px-1 group-data-[size=xs]/input-group:text-xs group-data-[size=xs]/input-group:[&>svg:not([class*='size-'])]:size-3 " +
  "group-data-[size=sm]/input-group:h-5 " +
  "group-data-[size=lg]/input-group:h-7 " +
  "group-data-[size=xl]/input-group:h-8 group-data-[size=xl]/input-group:rounded-md group-data-[size=xl]/input-group:px-2 group-data-[size=xl]/input-group:[&>svg:not([class*='size-'])]:size-4 " +
  "group-data-[size=2xl]/input-group:h-10 group-data-[size=2xl]/input-group:gap-1.5 group-data-[size=2xl]/input-group:rounded-md group-data-[size=2xl]/input-group:px-2.5 group-data-[size=2xl]/input-group:text-base group-data-[size=2xl]/input-group:[&>svg:not([class*='size-'])]:size-4"

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size,
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size" | "type"> &
  VariantProps<typeof inputGroupButtonVariants> & {
    type?: "button" | "submit" | "reset"
  }) {
  if (size == null) {
    return (
      <Button
        type={type}
        data-size="auto"
        variant={variant}
        className={cn(inputGroupButtonAutoSize, className)}
        {...props}
      />
    )
  }

  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-sm text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "size">) {
  const size = React.useContext(InputGroupSizeContext)

  return (
    <Input
      data-slot="input-group-control"
      size={size}
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: Omit<React.ComponentProps<"textarea">, "size">) {
  const size = React.useContext(InputGroupSizeContext)

  return (
    <Textarea
      data-slot="input-group-control"
      size={size}
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}

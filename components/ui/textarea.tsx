import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const textareaVariants = cva(
  "flex field-sizing-content w-full rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        xs: "min-h-12 rounded-[min(var(--radius-md),8px)] px-2 py-1 text-xs",
        sm: "min-h-14 rounded-[min(var(--radius-md),10px)] px-2.5 py-1.5 text-sm",
        default: "min-h-16 px-2.5 py-2 text-base md:text-sm",
        lg: "min-h-18 px-2.5 py-2 text-base md:text-sm",
        xl: "min-h-20 rounded-lg px-3 py-2.5 text-base",
        "2xl": "min-h-24 rounded-xl px-4 py-3 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Textarea({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"textarea">, "size"> &
  VariantProps<typeof textareaVariants>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants({ size, className }))}
      {...props}
    />
  )
}

export { Textarea, textareaVariants }

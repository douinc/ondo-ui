import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "w-full min-w-0 rounded-lg border border-input bg-transparent transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      size: {
        xs: "h-6 px-3 py-1 text-xs file:h-5 file:text-xs",
        sm: "h-8 px-3.5 py-1 text-sm file:h-6 file:text-xs",
        default: "h-9 px-3.5 py-1 text-base file:h-7 file:text-sm md:text-sm",
        lg: "h-10 px-3.5 py-1 text-base file:h-8 file:text-sm md:text-sm",
        xl: "h-11 rounded-xl px-4 py-1 text-base file:h-9 file:text-base",
        "2xl": "h-13 rounded-2xl px-5 py-1 text-lg file:h-11 file:text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Input({
  className,
  type,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cn(inputVariants({ size, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }

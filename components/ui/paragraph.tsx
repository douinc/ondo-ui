import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const paragraphVariants = cva("text-foreground", {
  variants: {
    size: {
      1: "text-[1.25rem]/[1.6] tracking-[-0.006em]",
      2: "text-[1.125rem]/[1.6] tracking-[-0.004em]",
      3: "text-[1.0625rem]/[1.65] tracking-[-0.002em]",
      4: "text-[1rem]/[1.65]",
      5: "text-[0.9375rem]/[1.6] tracking-[0.002em]",
      6: "text-[0.875rem]/[1.6] tracking-[0.004em]",
    },
    variant: {
      default: "text-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      danger: "text-destructive",
    },
    wrap: {
      normal: "text-wrap",
      nowrap: "text-nowrap",
      balance: "text-balance",
      pretty: "text-pretty",
    },
  },
  defaultVariants: {
    size: 4,
    variant: "default",
    wrap: "pretty",
  },
})

function Paragraph({
  className,
  size,
  variant = "default",
  wrap,
  render,
  ...props
}: useRender.ComponentProps<"p"> & VariantProps<typeof paragraphVariants>) {
  return useRender({
    defaultTagName: "p",
    props: mergeProps<"p">(
      {
        className: cn(paragraphVariants({ size, variant, wrap }), className),
      },
      props
    ),
    render,
    state: {
      slot: "paragraph",
      size: size ?? 4,
      variant,
    },
  })
}

export { Paragraph, paragraphVariants }

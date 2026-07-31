import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const headingVariants = cva("font-heading text-foreground", {
  variants: {
    size: {
      1: "text-[2.25rem]/[1.25] font-bold tracking-[-0.02em]",
      2: "text-[1.75rem]/[1.3] font-bold tracking-[-0.017em]",
      3: "text-[1.5rem]/[1.35] font-bold tracking-[-0.014em]",
      4: "text-[1.375rem]/[1.4] font-bold tracking-[-0.011em]",
      5: "text-[1.25rem]/[1.4] font-bold tracking-[-0.008em]",
      6: "text-[1.125rem]/[1.45] font-bold tracking-[-0.005em]",
    },
    wrap: {
      normal: "text-wrap",
      nowrap: "text-nowrap",
      balance: "text-balance",
      pretty: "text-pretty",
    },
  },
  defaultVariants: {
    size: 1,
    wrap: "normal",
  },
})

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

function Heading({
  className,
  level = 1,
  size,
  wrap,
  render,
  ...props
}: useRender.ComponentProps<"h1"> &
  VariantProps<typeof headingVariants> & {
    /** Heading rank. Sets the rendered tag and, unless `size` says otherwise, the visual size. */
    level?: HeadingLevel
  }) {
  const resolvedSize = size ?? level

  return useRender({
    defaultTagName: `h${level}`,
    props: mergeProps<"h1">(
      {
        className: cn(headingVariants({ size: resolvedSize, wrap }), className),
      },
      props
    ),
    render,
    state: {
      slot: "heading",
      level,
      size: resolvedSize,
    },
  })
}

export { Heading, headingVariants }

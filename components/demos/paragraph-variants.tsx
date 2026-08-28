import { Paragraph } from "@/components/ui/paragraph"

const variants = [
  "default",
  "primary",
  "secondary",
  "muted",
  "info",
  "success",
  "warning",
  "danger",
] as const

export default function ParagraphVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            variant=&quot;{variant}&quot;
          </span>
          <Paragraph variant={variant}>
            The {variant} paragraph variant.
          </Paragraph>
        </div>
      ))}
    </div>
  )
}

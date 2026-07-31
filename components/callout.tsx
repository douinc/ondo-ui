import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function Callout({
  title,
  children,
  icon,
  className,
  ...props
}: React.ComponentProps<typeof Alert> & {
  icon?: React.ReactNode
  type?: string
}) {
  // Legacy fumadocs prop; visual variants are intentionally collapsed.
  const { type: _type, ...alertProps } = props as { type?: string } & Omit<
    typeof props,
    "type"
  >

  return (
    <Alert
      className={cn(
        "not-typeset mt-6 w-auto rounded-2xl border-surface bg-surface text-surface-foreground md:-mx-1",
        className
      )}
      {...alertProps}
    >
      {icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription className="text-card-foreground/80">
        {children}
      </AlertDescription>
    </Alert>
  )
}

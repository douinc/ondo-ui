import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NumberBadge } from "@/components/compositions/number-badge"

const variants = [
  "default",
  "secondary",
  "destructive",
  "outline",
  "ghost",
] as const

const placements = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
] as const

export default function NumberBadgeVariants() {
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-wrap items-start justify-center gap-6">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-2">
            <NumberBadge value={8} variant={variant}>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </NumberBadge>
            <span className="text-xs text-muted-foreground capitalize">
              {variant}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-start justify-center gap-6">
        {placements.map((placement) => (
          <div key={placement} className="flex flex-col items-center gap-2">
            <NumberBadge value={8} placement={placement}>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </NumberBadge>
            <span className="text-xs text-muted-foreground">{placement}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

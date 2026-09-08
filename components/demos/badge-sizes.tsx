import { Badge } from "@/components/ui/badge"

export default function BadgeSizes() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge>Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  )
}

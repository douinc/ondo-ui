import { Toggle } from "@/components/ui/toggle"

export function ToggleSize() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Toggle extra small" size="xs">
        Extra small
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle small" size="sm">
        Small
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle default" size="default">
        Default
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle large" size="lg">
        Large
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle extra large" size="xl">
        Extra large
      </Toggle>
      <Toggle variant="outline" aria-label="Toggle 2x large" size="2xl">
        2X large
      </Toggle>
    </div>
  )
}

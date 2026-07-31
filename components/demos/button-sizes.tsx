import { IconPlus } from "@tabler/icons-react"

import { Button } from "@/components/ui/button"

export default function ButtonSizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="xl">Extra large</Button>
        <Button size="2xl">2X large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button size="icon-xs" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon-sm" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon-lg" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon-xl" aria-label="Add">
          <IconPlus />
        </Button>
        <Button size="icon-2xl" aria-label="Add">
          <IconPlus />
        </Button>
      </div>
    </div>
  )
}

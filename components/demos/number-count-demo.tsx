"use client"

import * as React from "react"
import { IconMinus, IconPlus } from "@tabler/icons-react"

import { NumberCount } from "@/components/ui/number-count"
import { Button } from "@/components/ui/button"

export default function NumberCountDemo() {
  const [value, setValue] = React.useState(100)

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setValue((v) => v - 1)}
        aria-label="Decrease"
      >
        <IconMinus />
      </Button>
      <NumberCount value={value} className="text-3xl font-semibold" />
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => setValue((v) => v + 1)}
        aria-label="Increase"
      >
        <IconPlus />
      </Button>
    </div>
  )
}

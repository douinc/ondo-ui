"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberCount } from "@/components/ui/number-count"
import { ProgressRing, ProgressRingLabel } from "@/components/ui/progress-ring"

export default function ProgressRingNumberCount() {
  const [value, setValue] = React.useState(24)

  return (
    <div className="flex flex-col items-center gap-4">
      <ProgressRing
        value={value}
        variant="info"
        formatValue={(_, v) =>
          v == null ? null : <NumberCount value={v} suffix="%" />
        }
      >
        <ProgressRingLabel>Uploading</ProgressRingLabel>
      </ProgressRing>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.max(0, v - 17))}
        >
          −17
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.min(100, v + 17))}
        >
          +17
        </Button>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { NumberCount } from "@/components/ui/number-count"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"

export default function ProgressNumberCount() {
  const [value, setValue] = React.useState(24)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Progress value={value} variant="info">
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue>
          {(_, v) => (v == null ? null : <NumberCount value={v} suffix="%" />)}
        </ProgressValue>
      </Progress>
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

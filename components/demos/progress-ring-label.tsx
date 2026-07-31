"use client"

import { ProgressRing, ProgressRingLabel } from "@/components/ui/progress-ring"

export default function ProgressRingLabelDemo() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ProgressRing value={0.42} max={1} format={{ style: "percent" }}>
        <ProgressRingLabel>Uploading</ProgressRingLabel>
      </ProgressRing>
      <ProgressRing
        value={3}
        max={5}
        variant="info"
        formatValue={(_, value) => `${value}/5`}
      >
        <ProgressRingLabel>Steps done</ProgressRingLabel>
      </ProgressRing>
    </div>
  )
}

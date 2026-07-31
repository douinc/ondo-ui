"use client"

import { ProgressRing, ProgressRingLabel } from "@/components/ui/progress-ring"

export default function ProgressRingIndeterminate() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ProgressRing value={null}>
        <ProgressRingLabel>Connecting</ProgressRingLabel>
      </ProgressRing>
      <ProgressRing value={null} variant="info" formatValue={() => "…"}>
        <ProgressRingLabel>Waiting for server</ProgressRingLabel>
      </ProgressRing>
    </div>
  )
}

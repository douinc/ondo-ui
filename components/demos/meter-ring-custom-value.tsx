"use client"

import { MeterRing, MeterRingLabel } from "@/components/ui/meter-ring"

export default function MeterRingCustomValue() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <MeterRing
        value={0}
        max={1}
        className="text-muted-foreground"
        formatValue={() => "—"}
      >
        <MeterRingLabel>Not scored yet</MeterRingLabel>
      </MeterRing>
      <MeterRing
        value={0.92}
        max={1}
        variant="success"
        formatValue={(_, value) =>
          value >= 0.9 ? "A" : value >= 0.7 ? "B" : "C"
        }
      >
        <MeterRingLabel>Grade</MeterRingLabel>
      </MeterRing>
    </div>
  )
}

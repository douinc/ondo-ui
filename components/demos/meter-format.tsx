"use client"

import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter"

export default function MeterFormat() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Meter value={0.68} max={1} format={{ style: "percent" }}>
        <MeterLabel>Coverage</MeterLabel>
        <MeterValue />
      </Meter>
      <Meter
        value={412}
        max={500}
        format={{ maximumFractionDigits: 0 }}
        variant="info"
      >
        <MeterLabel>Seats</MeterLabel>
        <MeterValue>{(formatted) => `${formatted} of 500`}</MeterValue>
      </Meter>
    </div>
  )
}

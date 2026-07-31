import { MeterRing, MeterRingLabel } from "@/components/ui/meter-ring"

export default function MeterRingFormat() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <MeterRing value={0.68} max={1} format={{ style: "percent" }}>
        <MeterRingLabel>Coverage</MeterRingLabel>
      </MeterRing>
      <MeterRing
        value={412}
        max={500}
        format={{ maximumFractionDigits: 0 }}
        variant="info"
      >
        <MeterRingLabel>412 of 500 seats</MeterRingLabel>
      </MeterRing>
    </div>
  )
}

import { MeterRing, MeterRingLabel } from "@/components/ui/meter-ring"

export default function MeterRingVariants() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <MeterRing variant="destructive" value={18}>
        <MeterRingLabel>Critical</MeterRingLabel>
      </MeterRing>
      <MeterRing variant="info" value={34}>
        <MeterRingLabel>Nominal</MeterRingLabel>
      </MeterRing>
      <MeterRing variant="warning" value={46}>
        <MeterRingLabel>At risk</MeterRingLabel>
      </MeterRing>
      <MeterRing variant="success" value={91}>
        <MeterRingLabel>Healthy</MeterRingLabel>
      </MeterRing>
    </div>
  )
}

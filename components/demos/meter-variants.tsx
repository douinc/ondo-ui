import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter"

export default function MeterVariants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Meter value={18} variant="destructive">
        <MeterLabel>Critical</MeterLabel>
        <MeterValue />
      </Meter>
      <Meter value={34} variant="info">
        <MeterLabel>Nominal</MeterLabel>
        <MeterValue />
      </Meter>
      <Meter value={46} variant="warning">
        <MeterLabel>At risk</MeterLabel>
        <MeterValue />
      </Meter>
      <Meter value={91} variant="success">
        <MeterLabel>Healthy</MeterLabel>
        <MeterValue />
      </Meter>
    </div>
  )
}

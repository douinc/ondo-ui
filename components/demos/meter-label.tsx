import { Meter, MeterLabel, MeterValue } from "@/components/ui/meter"

export default function MeterLabelDemo() {
  return (
    <Meter value={68} variant="success" className="w-full max-w-sm">
      <MeterLabel>Disk used</MeterLabel>
      <MeterValue />
    </Meter>
  )
}

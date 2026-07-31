import { MeterRing } from "@/components/ui/meter-ring"

export default function MeterRingSizes() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <MeterRing size="sm" value={38} />
      <MeterRing value={62} />
      <MeterRing size="lg" value={86} />
    </div>
  )
}

import { ProgressRing } from "@/components/ui/progress-ring"

export default function ProgressRingSizes() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      <ProgressRing size="sm" value={38} />
      <ProgressRing value={62} />
      <ProgressRing size="lg" value={86} />
    </div>
  )
}

import { ProgressRing, ProgressRingLabel } from "@/components/ui/progress-ring"

export default function ProgressRingVariants() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ProgressRing variant="destructive" value={18}>
        <ProgressRingLabel>Stalled</ProgressRingLabel>
      </ProgressRing>
      <ProgressRing variant="info" value={34}>
        <ProgressRingLabel>Syncing</ProgressRingLabel>
      </ProgressRing>
      <ProgressRing variant="warning" value={46}>
        <ProgressRingLabel>Retrying</ProgressRingLabel>
      </ProgressRing>
      <ProgressRing variant="success" value={100}>
        <ProgressRingLabel>Done</ProgressRingLabel>
      </ProgressRing>
    </div>
  )
}

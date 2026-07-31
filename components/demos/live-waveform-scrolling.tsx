import { LiveWaveform } from "@/components/ui/live-waveform"

export default function LiveWaveformScrolling() {
  return (
    <div className="w-full max-w-sm">
      <LiveWaveform processing mode="scrolling" className="text-foreground" />
    </div>
  )
}

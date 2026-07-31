import { LiveWaveform } from "@/components/ui/live-waveform"

export default function LiveWaveformStatic() {
  return (
    <div className="w-full max-w-sm">
      <LiveWaveform processing mode="static" className="text-foreground" />
    </div>
  )
}

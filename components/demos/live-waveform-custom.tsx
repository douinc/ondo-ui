import { LiveWaveform } from "@/components/ui/live-waveform"

export default function LiveWaveformCustom() {
  return (
    <div className="w-full max-w-sm">
      <LiveWaveform
        processing
        mode="static"
        barWidth={4}
        barGap={2}
        barRadius={2}
        barColor="#8b5cf6"
        height={100}
        fadeEdges
      />
    </div>
  )
}

"use client"

import * as React from "react"
import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react"

import { LiveWaveform } from "@/components/ui/live-waveform"
import { Button } from "@/components/ui/button"

const presets = [
  { label: "Default", barWidth: 4, barGap: 2, barRadius: 2, barHeight: 4 },
  { label: "Hairline", barWidth: 1, barGap: 2, barRadius: 0, barHeight: 2 },
  { label: "Pill", barWidth: 8, barGap: 5, barRadius: 4, barHeight: 8 },
  { label: "Blocks", barWidth: 6, barGap: 2, barRadius: 0, barHeight: 6 },
  {
    label: "Tall & sparse",
    barWidth: 2,
    barGap: 4,
    barRadius: 1,
    barHeight: 14,
  },
  {
    label: "No fade",
    barWidth: 4,
    barGap: 2,
    barRadius: 2,
    barHeight: 5,
    fadeEdges: false,
  },
]

export default function LiveWaveformGeometry() {
  const [stream, setStream] = React.useState<MediaStream | null>(null)
  const listening = stream !== null

  const start = async () => {
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ audio: true }))
    } catch {
      // Permission denied — stay in the idle processing state.
    }
  }

  const stop = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      {presets.map(({ label, ...geometry }) => (
        <div key={label} className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">{label}</span>
          {/* One shared microphone drives every preset. The processing shape is
              only the pre-recording state — once listening, the bars follow the
              live signal even through silence. */}
          <LiveWaveform
            stream={stream}
            active={listening}
            processing={!listening}
            height={48}
            {...geometry}
          />
        </div>
      ))}
      <Button
        variant={listening ? "default" : "outline"}
        size="sm"
        onClick={listening ? stop : start}
        className="self-center"
      >
        {listening ? <IconMicrophoneOff /> : <IconMicrophone />}
        {listening ? "Stop" : "Start listening"}
      </Button>
    </div>
  )
}

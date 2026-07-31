"use client"

import * as React from "react"

import { LiveWaveform } from "@/components/ui/live-waveform"
import { Button } from "@/components/ui/button"

export default function LiveWaveformProcessing() {
  const [processing, setProcessing] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <LiveWaveform
        processing={processing}
        mode="static"
        className="text-foreground"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setProcessing((v) => !v)}
      >
        {processing ? "Stop" : "Start"} processing
      </Button>
    </div>
  )
}

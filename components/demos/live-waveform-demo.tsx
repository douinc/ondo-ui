"use client"

import * as React from "react"
import { IconMicrophone, IconMicrophoneOff } from "@tabler/icons-react"

import { LiveWaveform } from "@/components/ui/live-waveform"
import { Button } from "@/components/ui/button"

export default function LiveWaveformDemo() {
  const [active, setActive] = React.useState(false)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <LiveWaveform active={active} height={64} />
      <Button
        variant={active ? "default" : "outline"}
        size="sm"
        onClick={() => setActive((v) => !v)}
      >
        {active ? <IconMicrophoneOff /> : <IconMicrophone />}
        {active ? "Stop" : "Start listening"}
      </Button>
    </div>
  )
}
